using Microsoft.AspNetCore.Mvc.RazorPages;
using PuppeteerSharp;
using Server.Models.Scrap;
using System;
using System.Diagnostics;

namespace Server.Services.Scrap
{
    public class ScrapService : IScrapService
    {
        private readonly ILogger<ScrapService> _logger;

        public IPage Page { get; set; }
        public IBrowser Browser { get; set; }

        public ScrapService(ILogger<ScrapService> logger)
        {
            Page = null!;
            Browser = null!;
            _logger = logger;
        }

        #region init browser
        private async Task InitializeAsync()
        {
            var pageBrowser = await GetPageAsync(devtools: false, headless: false);
            Page = pageBrowser.Item1;
            Browser = pageBrowser.Item2;
        }

        private async Task<Tuple<IPage, IBrowser>> GetPageAsync(bool devtools, bool headless)
        {
            var launchOptions = new LaunchOptions
            {
                Devtools = devtools,
                Headless = headless,
                Args = new[]
                {
                    "--disable-web-security",
                    "--disable-features=IsolateOrigins,site-per-process",
                    "--no-sandbox,--disable-setuid-sandbox"
                },
            };

            var broserFetcer = new BrowserFetcher();
            await broserFetcer.DownloadAsync();
            var browser = await Puppeteer.LaunchAsync(launchOptions);
            var page = await browser.NewPageAsync();
            page.DefaultNavigationTimeout = 120 * 1000;

            return new Tuple<IPage, IBrowser>(page, browser);
        }
        #endregion

        #region f1 standings
        public async Task<F1StandingDto> F1StandingsAsync(string type, string year)
        {
            _logger.LogInformation($"Scrap starts");

            F1StandingsValidation(type, year);
            await InitializeAsync();

            try
            {
                var result = await F1StandingsScrapAsync(type, year);
                return result;
            }
            catch (Exception)
            {
                throw;
            }
            finally
            {
                if (Page != null)
                {
                    await Page.CloseAsync();
                    await Browser.CloseAsync();
                }
            }
        }

        private void F1StandingsValidation(string type, string year)
        {
            if (string.IsNullOrWhiteSpace(type) || string.IsNullOrWhiteSpace(year))
            {
                throw new ArgumentException("Type and year are required.");
            }

            if (type != "drivers" && type != "constructors")
            {
                throw new ArgumentException("Type must be either 'drivers' or 'constructors'.");
            }

            if (!int.TryParse(year, out int parsedYear) || parsedYear < 2001)
            {
                throw new ArgumentException("Year must be a valid integer greater than or equal to 2001.");
            }
        }

        private async Task<F1StandingDto> F1StandingsScrapAsync(string type, string year)
        {
            var url = string.Empty;
            var f1StandingDto = new F1StandingDto()
            {
                ColumnLabels = new List<F1Standing_ColumnLabel>(),
                RaceTacks = new List<string>(),
                RowLabels = new List<F1Standing_RowLabel>(),
            };            

            #region example url
            /*
            drivers año actual - https://www.espn.com/f1/standings
            drivers otros años - https://www.espn.com/f1/standings/_/season/2024
            constructors año actual - https://www.espn.com/f1/standings/_/group/constructors
            constructors otros años - https://www.espn.com/f1/standings/_/season/2024/group/constructors
            */
            #endregion

            #region step 1 - fix urls
            if (year == DateTime.Now.Year.ToString())
            {
                if (type == "drivers")
                {
                    url = "https://www.espn.com/f1/standings";
                }
                else if (type == "constructors")
                {
                    url = "https://www.espn.com/f1/standings/_/group/constructors";
                }
            }
            else
            {
                if (type == "drivers")
                {
                    url = $"https://www.espn.com/f1/standings/_/season/{year}";
                }
                else if (type == "constructors")
                {
                    url = $"https://www.espn.com/f1/standings/_/season/{year}/group/constructors";
                }
            }
            #endregion

            #region step 2 - scrap data
            _logger.LogInformation($"Scrap - wait for main");
            await Page.GoToAsync(url);
            await Page.WaitForSelectorAsync(".standings__table");            
            await Task.Delay(1000 * 3);

            _logger.LogInformation($"Scrap - getting div");
            var div = await Page.QuerySelectorAsync("div[class*='standings__table'] > div[class*='ResponsiveTable']");
            await Task.Delay(1000 * 1);

            // driver/constructor
            {
                _logger.LogInformation($"Scrap - getting divers/constructors");
                var trs = await div.QuerySelectorAllAsync("div[class*='flex'] > table > tbody > tr");
                await Task.Delay(1000 * 3);

                if (trs == null)
                {
                    throw new Exception("Some weird error");
                }

                foreach (var tr in trs)
                {
                    await Task.Delay(100 * 1);

                    var tds = await tr.QuerySelectorAllAsync("td");
                    var spans = await tds[0].QuerySelectorAllAsync("span");

                    var position = await spans[0].EvaluateFunctionAsync<string>("el => el.textContent.trim()");
                    var img = await spans[1].QuerySelectorAsync("img");  
                    var imgName = string.Empty;
                    if (img != null)
                    {                        
                        imgName = await img.EvaluateFunctionAsync<string>("el => el.src.trim()");
                    }
                    var abbreviation = await spans[2].QuerySelectorAsync("abbr");
                    var abbreviationName = string.Empty;
                    if (abbreviation != null)
                    {
                        abbreviationName = await abbreviation.EvaluateFunctionAsync<string>("el => el.textContent.trim()");
                    }
                    var name = await spans[3].EvaluateFunctionAsync<string>("el => el.textContent.trim()");

                    f1StandingDto.ColumnLabels.Add(new F1Standing_ColumnLabel
                    {
                        Position = position,
                        Image = imgName,
                        Abbreviation = abbreviationName,
                        Name = name
                    });
                }
            }            
            
            // race track
            {
                _logger.LogInformation($"Scrap - getting race traks");
                var table = await div.QuerySelectorAsync("div[class*='flex'] > div[class*='Table__ScrollerWrapper'] > div[class*='Table__Scroller'] > table");
                await Task.Delay(1000 * 3);

                if (table == null)
                {
                    throw new Exception("Some weird error");
                }

                var thead_a = await table.QuerySelectorAllAsync("thead > tr > th > span > a");
                await Task.Delay(1000 * 3);

                foreach (var a in thead_a)
                {
                    var name = await a.EvaluateFunctionAsync<string>("el => el.textContent.trim()");
                    f1StandingDto.RaceTacks.Add(name);
                }

                int i = 0, j = 0;

                var tbody_trs = await table.QuerySelectorAllAsync("tbody > tr");
                await Task.Delay(100);

                foreach (var tr in tbody_trs)
                {
                    f1StandingDto.RowLabels.Add(new F1Standing_RowLabel
                    {
                        Points = new List<string>()
                    });

                    var tds = await tr.QuerySelectorAllAsync("td");
                    await Task.Delay(100);

                    j = 0;
                    foreach (var td in tds)
                    {
                        await Task.Delay(100);
                        _logger.LogInformation($"Row {i} - {j}");

                        var span = await td.QuerySelectorAsync("span");
                        var points = await span.EvaluateFunctionAsync<string>("el => el.textContent.trim()");
                        f1StandingDto.RowLabels.Last().Points.Add(points);

                        j++;
                    }

                    i++;
                }
            }            
            #endregion

            return f1StandingDto;
        }
        #endregion
    }
}
