using Server.Source.Models.Entities.WebScraping;

namespace Server.Source.Data.Scrap
{
    public interface IScrapDataRepository
    {
        IQueryable<Formula1StandingEntity> GetFormula1Standings(string type, int year);
        IQueryable<Formula1StandingEntity> GetFormula1StandingsByPage(string sortColumn, string sortOrder, int pageSize, int pageNumber, string term, string filters, out int grandTotal);
        Task<bool> UpsertFormula1StandingsAsync(string type, int year, string dataJson);
    }
}
