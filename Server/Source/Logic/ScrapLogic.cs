using Microsoft.EntityFrameworkCore;
using PuppeteerSharp;
using Server.Source.Data.Interfaces;
using Server.Source.Helpers;
using Server.Source.Models;
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

        public async Task<ApiResponse<Formula1StandingScrap>> GetFormula1StandingsAsync(string type, int year)
        {
            var data = await _scrapDataRepository
                .GetFormula1Standings(type, year)
                .Select(p => new { p.EventAt, p.DataJson })
                .FirstOrDefaultAsync();

            if (data == null)
            {
                return null!;
            }

            return new ApiResponse<Formula1StandingScrap>()
            {        
                Data = JsonSerializer.Deserialize<Formula1StandingScrap>(data.DataJson)!                
            };
        }

        public async Task<ApiResponse<DateTime>> GetFormula1StandingsExistsAsync(string type, int year)
        {
            var data = await _scrapDataRepository
                .GetFormula1Standings(type, year)
                .Select(p => new { p.EventAt })
                .FirstOrDefaultAsync();

            if (data == null)
            {
                return null!;
            }

            return new ApiResponse<DateTime>()
            {
                Data = data.EventAt,
            };
        }

        public async Task<ApiResponse<List<Formula1StandingDto>>> GetFormula1StandingsAsync(string sortColumn, string sortOrder, int pageNumber, int pageSize, string? term, string? filters)
        {
            var data = await _scrapDataRepository
                .GetFormula1StandingsByPage(sortColumn, sortOrder, pageNumber, pageSize, term: term ?? string.Empty, filters: filters ?? string.Empty, out int grandTotal)
                .Select(p => new Formula1StandingDto()
                {
                    Id = p.Id,
                    Type = p.Type,
                    Year = p.Year,
                    EventAt = p.EventAt,
                })
                .ToListAsync();

            return new ApiResponse<List<Formula1StandingDto>>()
            {
                Data = data,
                GrandTotal = grandTotal,
            };
        }

        #region helper methods
        private void Formula1StandingsValidation(string type, int year)
        {
            _logger.LogInformation("Validating Formula 1 standings request: Type={Type}, Year={Year}", type, year);

  
        }
        #endregion
    }
}
