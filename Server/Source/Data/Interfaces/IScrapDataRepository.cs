using Server.Source.Models.Entities;

namespace Server.Source.Data.Interfaces
{
    public interface IScrapDataRepository
    {
        IQueryable<Formula1StandingEntity> GetFormula1Standings(string type, int year);
        Task SaveFormula1StandingAsync(Formula1StandingEntity entity);
    }
}
