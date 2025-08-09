using Microsoft.EntityFrameworkCore;
using Server.Source.Data.Interfaces;
using Server.Source.Helpers;
using Server.Source.Models.Entities;
using System.Linq.Expressions;

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

        public IQueryable<Formula1StandingEntity> GetFormula1StandingsByPage(string sortColumn, string sortOrder, int pageNumber, int pageSize, string term, string filters, out int grandTotal)
        {
            IQueryable<Formula1StandingEntity> iq;
            IOrderedQueryable<Formula1StandingEntity> ioq = null!;

            var filterPage = PageFilterHelper.GetInfo(filters!);
            List<string> filtersListType = filterPage[0].Data;
            List<int> filtersListYear = filterPage[1].Data.Select(p => int.Parse(p)).ToList();

            Expression<Func<Formula1StandingEntity, bool>> exp = p => true;

            // filttering by type and year
            iq = _context.Formula1Standings
                .Where(exp)
                .Where(p => filtersListType.Contains(p.Type!))
                .Where(p => filtersListYear.Contains(p.Year!));

            // counting total records
            grandTotal = iq.Count();

            // ordering
            if (sortColumn == "type")
            {
                ioq = sortOrder == "asc" ? iq.OrderBy(p => p.Type) : iq.OrderByDescending(p => p.Type);
            }
            else if (sortColumn == "year")
            {
                ioq = sortOrder == "asc" ? iq.OrderBy(p => p.Year) : iq.OrderByDescending(p => p.Year);
            }
            else
            {
                ioq = sortOrder == "asc" ? iq.OrderBy(p => p.EventAt) : iq.OrderByDescending(p => p.EventAt);
            }
            
            iq = ioq!
                .Skip((pageNumber - 1) * pageSize)
                .Take(pageSize);

            return iq.AsNoTracking();
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
                    DataJson = dataJson,
                    EventAt = DateTime.Now
                };
                _context.Formula1Standings.Add(entity);
                await _context.SaveChangesAsync();

                return true;
            }
            else
            {
                entity.DataJson = dataJson;
                entity.EventAt = DateTime.Now;
                _context.Formula1Standings.Update(entity);
                await _context.SaveChangesAsync();

                return false;
            }
        }
    }
}
