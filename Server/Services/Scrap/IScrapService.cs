using Microsoft.AspNetCore.Mvc.RazorPages;
using PuppeteerSharp;
using Server.Models.Scrap;

namespace Server.Services.Scrap
{
    public interface IScrapService
    {
        Task<F1StandingDto> F1StandingsAsync(string type, string year);
    }
}
