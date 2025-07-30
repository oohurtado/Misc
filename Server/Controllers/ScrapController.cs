using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Server.Services.Scrap;

namespace Server.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ScrapController : ControllerBase
    {
        private readonly IScrapService _scrapService;

        public ScrapController(IScrapService scrapService)
        {
            _scrapService = scrapService;
        }

        /// <summary>
        /// 
        /// </summary>
        /// <param name="type">divers/constructors</param>
        /// <param name="year">2001..</param>
        /// <returns></returns>
        [HttpGet]
        [Route("f1-standings/{type:required}/{year:required}")]
        public async Task<IActionResult> F1StandingsAsync(string type, string year)
        {
            var result = await _scrapService.F1StandingsAsync(type, year);
            return Ok(result);
        }
    }
}
