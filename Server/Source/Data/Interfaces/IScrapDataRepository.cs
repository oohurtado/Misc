using Server.Source.Models.Entities;

namespace Server.Source.Data.Interfaces
{
    public interface IScrapDataRepository
    {
        IQueryable<Formula1StandingEntity> GetFormula1Standings(string type, int year);
        Task<bool> UpsertFormula1StandingsAsync(string type, int year, string dataJson);
    }
}
