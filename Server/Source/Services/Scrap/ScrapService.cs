using Microsoft.AspNetCore.Mvc.RazorPages;
using Microsoft.Extensions.Logging;
using PuppeteerSharp;
using Server.Source.Models.Scrap.Formula1;
using System;
using System.Diagnostics;

namespace Server.Source.Services.Scrap
{
    public class ScrapService : IScrapService
    {        
        public event Func<string, Task>? ProgressEvt;

        public IPage Page { get; set; }
        public IBrowser Browser { get; set; }

        public ScrapService()
        {
            Page = null!;
            Browser = null!;
        }

        #region init browser
        private async Task InitializeAsync()
        {
            Notify("Initializing Puppeteer browser...");

            var pageBrowser = await GetPageAsync(devtools: true, headless: true);
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
                    "--no-sandbox,--disable-setuid-sandbox",
                    
                    "--disable-dev-shm-usage",                     
                    "--disable-gpu",

                    "--disable-notifications",
                    "--disable-sync",
                    "--disable-background-networking"
                },
                
                DumpIO = true, // Sends the browser logs to the console
            };

            var broserFetcer = new BrowserFetcher();
            await broserFetcer.DownloadAsync();
            var browser = await Puppeteer.LaunchAsync(launchOptions);
            var page = await browser.NewPageAsync();
            page.DefaultNavigationTimeout = 120 * 1000;

            return new Tuple<IPage, IBrowser>(page, browser);
        }
        #endregion

        #region formula1 standings
        public async Task<Formula1StandingScrap> Formula1StandingsAsync(string type, int year)
        {
            await InitializeAsync();

            try
            {
                var result = await Formula1StandingsScrapAsync(type, year);
                return result;
            }
            catch (Exception)
            {
                Notify("An error occurred while scraping Formula 1 standings.");
                throw;
            }
            finally
            {
                Notify("Closing Puppeteer browser...");
                if (Page != null)
                {
                    await Page.CloseAsync();
                    await Browser.CloseAsync();
                }
            }
        }

        private async Task<Formula1StandingScrap> Formula1StandingsScrapAsync(string type, int year)
        {
            var url = string.Empty;
            var data = new Formula1StandingScrap()
            {
                Columns = new List<Formula1StandingScrap_Column>(),
                Rows = new List<string>(),
                Points = new List<List<string>>(),
            };            

            #region example url
            /*
            drivers año actual - https://www.espn.com/f1/standings
            drivers otros años - https://www.espn.com/f1/standings/_/season/2024
            constructors año actual - https://www.espn.com/f1/standings/_/group/constructors
            constructors otros años - https://www.espn.com/f1/standings/_/season/2024/group/constructors
            */
            #endregion

            #region fix urls            
            if (year == DateTime.Now.Year)
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

            #region some events            
            await Page.SetRequestInterceptionAsync(true);

            Page.Request += async (sender, e) =>
            {
                var url = e.Request.Url.ToLower();                

                if (!url.Contains("espn"))
                {
                    await e.Request.AbortAsync();
                }
                else
                {
                    //_logger.LogInformation($"Scrap - intercepts request {url}");
                    await e.Request.ContinueAsync();
                }
            };
            //Page.Close += (_, _) => _logger.LogInformation($"Scrap - page closed");
            //Browser.Disconnected += (_, _) => _logger.LogInformation($"Scrap - browser disconnected");
            #endregion

            #region scrap data
            Notify($"Scrap - going to page {url} for {type} in {year}");
            await Page.GoToAsync(url);
            //await Page.EvaluateExpressionAsync("setInterval(() => console.log('keep alive'), 10000)");                  

            Notify($"Scrap - getting main div");
            var div = await Page.QuerySelectorAsync("div[class*='standings__table'] > div[class*='ResponsiveTable']");

            // driver/constructor
            {
                Notify($"Scrap - getting drivers/constructors");
                var trs = await div.QuerySelectorAllAsync("div[class*='flex'] > table > tbody > tr");

                if (trs == null)
                {
                    throw new Exception("Some weird error");
                }

                foreach (var tr in trs)
                {
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

                    data.Columns.Add(new Formula1StandingScrap_Column()
                    {
                        Position = position,
                        Abbreviation = abbreviationName,
                        Name = name,
                        Image = imgName,
                    });
                }
            }            
            
            // race track
            {
                Notify($"Scrap - getting race tracks");
                var table = await div.QuerySelectorAsync("div[class*='flex'] > div[class*='Table__ScrollerWrapper'] > div[class*='Table__Scroller'] > table");
                if (table == null)
                {
                    throw new Exception("Some weird error");
                }

                var thead_a = await table.QuerySelectorAllAsync("thead > tr > th > span > a");
                foreach (var a in thead_a)
                {
                    var name = await a.EvaluateFunctionAsync<string>("el => el.textContent.trim()");
                    data.Rows.Add(name);
                }

                Notify($"Scrap - getting rece tracks points");
                var tbody_trs = await table.QuerySelectorAllAsync("tbody > tr");
                foreach (var tr in tbody_trs)
                {
                    var tds = await tr.QuerySelectorAllAsync("td");

                    var tmpPoints = new List<string>();
                    foreach (var td in tds)
                    {
                        var span = await td.QuerySelectorAsync("span");
                        var points = await span.EvaluateFunctionAsync<string>("el => el.textContent.trim()");
                        tmpPoints.Add(points);
                    }

                    data.Points.Add(tmpPoints);
                }
            }            
            #endregion

            return data;
        }
        #endregion

        private void Notify(string msg)
        {
            ProgressEvt?.Invoke(msg);
        }
    }
}
