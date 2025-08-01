using Microsoft.EntityFrameworkCore;
using Server.Source.Data.Interfaces;
using Server.Source.Models.Entities;

namespace Server.Source.Data
{
    public class ScrapDataRepository : IScrapDataRepository
    {
        private readonly DatabaseContext _context;

        public ScrapDataRepository(DatabaseContext context)
        {
            _context = context;
        }

        public IQueryable<Formula1StandingEntity> GetFormula1Standings(string type, int year)
        {
            return _context.Formula1Standings.Where(s => s.Type == type && s.Year == year);
        }

        public async Task<bool> UpsertFormula1StandingsAsync(string type, int year, string dataJson)
        {
            var entity = await _context.Formula1Standings.FirstOrDefaultAsync(s => s.Type == type && s.Year == year);
            if (entity == null)
            {
                entity = new Formula1StandingEntity
                {
                    Type = type,
                    Year = year,
                    DataJson = dataJson
                };
                _context.Formula1Standings.Add(entity);
                await _context.SaveChangesAsync();

                return true;
            }
            else
            {
                entity.DataJson = dataJson;
                _context.Formula1Standings.Update(entity);
                await _context.SaveChangesAsync();

                return false;
            }
        }
    }
}
