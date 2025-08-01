using Microsoft.AspNetCore.Mvc.RazorPages;
using PuppeteerSharp;
using Server.Source.Models.Scrap;

namespace Server.Source.Services.Scrap
{
    public interface IScrapService
    {
        Task<Formula1StandingDto> Formula1StandingsAsync(string type, int year);
    }
}
