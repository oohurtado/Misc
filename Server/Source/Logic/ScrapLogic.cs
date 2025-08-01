using Microsoft.EntityFrameworkCore;
using PuppeteerSharp;
using Server.Source.Data.Interfaces;
using Server.Source.Models.Entities;
using Server.Source.Models.Scrap.Formula1;
using Server.Source.Services.Scrap;
using System.Text.Json;
using static System.Runtime.InteropServices.JavaScript.JSType;

namespace Server.Source.Logic
{
    public class ScrapLogic
    {
        private readonly IScrapService _scrapService;
        private readonly IScrapDataRepository _scrapDataRepository;
        private readonly ILogger<ScrapLogic> _logger;

        public ScrapLogic(
            IScrapService scrapService,
            IScrapDataRepository scrapDataRepository,
            ILogger<ScrapLogic> logger
            )
        {
            _scrapService = scrapService;
            _scrapDataRepository = scrapDataRepository;
            _logger = logger;
        }

        public async Task UpsertFormula1StandingsAsync(Formula1StantingRequest request)
        {
            Formula1StandingsValidation(request.Type, request.Year);

            // current year
            if (request.Year == DateTime.Now.Year)
            {
                _logger.LogInformation("Current year standings requested: {Year}", request.Year);
                var data = await _scrapService.Formula1StandingsAsync(request.Type, request.Year);
                var entity = new Formula1StandingEntity
                {
                    Type = request.Type,
                    Year = request.Year,
                    DataJson = JsonSerializer.Serialize(data)
                };

                var result = await _scrapDataRepository.UpsertFormula1StandingsAsync(request.Type, request.Year, dataJson: JsonSerializer.Serialize(data));
                _logger.LogInformation($"Upserting data ({(result ? "creating" : "updating" )})");
                return;
            }

            // previous years
            {
                _logger.LogInformation("Getting data");
                var existsData = await _scrapDataRepository.GetFormula1Standings(request.Type, request.Year).AnyAsync();
                if (existsData)
                {
                    // if data exists, we do nothing
                    _logger.LogInformation("Data for {Type} in {Year} already exists, no need to scrap again.", request.Type, request.Year);
                    return;
                }
                else
                {
                    var data = await _scrapService.Formula1StandingsAsync(request.Type, request.Year);
                    var entity = new Formula1StandingEntity
                    {
                        Type = request.Type,
                        Year = request.Year,
                        DataJson = JsonSerializer.Serialize(data)
                    };
                    await _scrapDataRepository.UpsertFormula1StandingsAsync(request.Type, request.Year, dataJson: JsonSerializer.Serialize(data));
                    _logger.LogInformation("Data for {Type} in {Year} does not exist, scrapping and saving.", request.Type, request.Year);
                    return;
                }
            }
        }

        public async Task<Formula1StandingResponse> GetFormula1StandingsAsync(string type, int year)
        {
            var data = await _scrapDataRepository
                .GetFormula1Standings(type, year)
                .Select(p => new { p.EventAt, p.DataJson })
                .FirstOrDefaultAsync();

            if (data == null)
            {
                return null!;
            }

            return new Formula1StandingResponse()
            {
                EventAt = data.EventAt,
                Data = JsonSerializer.Deserialize<Formula1StandingScrap>(data.DataJson)
            };
        }

        #region helper methods
        private void Formula1StandingsValidation(string type, int year)
        {
            _logger.LogInformation("Validating Formula 1 standings request: Type={Type}, Year={Year}", type, year);

            if (year > DateTime.Now.Year)
            {
                throw new ArgumentException("Year cannot be in the future.");
            }
            if (year < 2001)
            {
                throw new ArgumentException("Year must be a valid integer greater than or equal to 2001.");
            }
            if (type != "drivers" && type != "constructors")
            {
                throw new ArgumentException("Type must be either 'drivers' or 'constructors'.");
            }
        } 
        #endregion
    }
}
