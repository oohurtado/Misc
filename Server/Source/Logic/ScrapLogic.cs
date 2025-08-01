using Microsoft.EntityFrameworkCore;
using Server.Source.Data.Interfaces;
using Server.Source.Models.Entities;
using Server.Source.Models.Scrap;
using Server.Source.Services.Scrap;
using System.Text.Json;

namespace Server.Source.Logic
{
    public class ScrapLogic
    {
        private readonly IScrapService _scrapService;
        private readonly IScrapDataRepository _scrapDataRepository;

        public ScrapLogic(
            IScrapService scrapService,
            IScrapDataRepository scrapDataRepository
            )
        {
            _scrapService = scrapService;
            _scrapDataRepository = scrapDataRepository;
        }

        public async Task<Formula1StandingDto> Formula1StandingsAsync(string type, int year)
        {
            Formula1StandingsValidation(type, year);

            // since the current championship is not over, we scrap the data every time user asks for it
            if (year == DateTime.Now.Year)
            {
                var result = await _scrapService.Formula1StandingsAsync(type, year);
                return result;
            }

            // if the year is not the current one, we check if the data is already in the database
            var data = await _scrapDataRepository
                .GetFormula1Standings(type, year)
                .Select(p => p.DataJson)
                .FirstOrDefaultAsync();

            // if the data is found, we deserialize it and return the model
            if (!string.IsNullOrEmpty(data))
            {
                var model = JsonSerializer.Deserialize<Formula1StandingDto>(data);
                return model!;
            }
            // if the data is not found, we scrap it and save it to the database
            else
            {
                var result = await _scrapService.Formula1StandingsAsync(type, year);
                var entity = new Formula1StandingEntity
                {
                    Type = type,
                    Year = year,
                    DataJson = JsonSerializer.Serialize(result)
                };
                await _scrapDataRepository.SaveFormula1StandingAsync(entity);
                return result;
            }     
        }

        private void Formula1StandingsValidation(string type, int year)
        {
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
    }
}
