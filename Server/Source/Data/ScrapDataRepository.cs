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

        public async Task SaveFormula1StandingAsync(Formula1StandingEntity entity)
        {
            _context.Formula1Standings.Add(entity);
            await _context.SaveChangesAsync();
        }
    }
}
