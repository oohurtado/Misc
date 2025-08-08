using Microsoft.AspNetCore.Mvc.RazorPages;
using PuppeteerSharp;
using Server.Source.Models.Scrap.Formula1;

namespace Server.Source.Services.Scrap
{
    public interface IScrapService
    {
        event Func<string, Task> ProgressEvt;
        Task<Formula1StandingScrap> Formula1StandingsAsync(string type, int year);
    }
}
