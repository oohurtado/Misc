using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Server.Source.Logic;
using Server.Source.Services.Scrap;

namespace Server.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ScrapController : ControllerBase
    {
        private readonly ScrapLogic _scrapLogic;

        public ScrapController(ScrapLogic scrapLogic)
        {
            _scrapLogic = scrapLogic;
        }

        /// <summary>
        /// 
        /// </summary>
        /// <param name="type">divers/constructors</param>
        /// <param name="year">2001..</param>
        /// <returns></returns>
        [HttpGet]
        [Route("formula1/standings/{type:required}/{year:required}")]
        public async Task<IActionResult> Formula1StandingsAsync(string type, int year)
        {
            var result = await _scrapLogic.Formula1StandingsAsync(type, year);
            return Ok(result);
        }
    }
}
