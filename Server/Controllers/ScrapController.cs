using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Server.Source.Logic;
using Server.Source.Models.Scrap.Formula1;
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

        [HttpPost]
        [Route("formula1/standings")]
        public async Task<IActionResult> UpsertFormula1Standing([FromBody] Formula1StantingRequest request)
        {
            await _scrapLogic.UpsertFormula1StandingsAsync(request);
            return Ok();
        }

        [HttpGet]
        [Route("formula1/standings/{type:required}/{year:required}")]
        public async Task<IActionResult> Formula1StandingsAsync(string type, int year)
        {
            var result = await _scrapLogic.GetFormula1StandingsAsync(type, year);
            if (result == null)
            {
                return NotFound();
            }
            
            return Ok(result);
        }
    }
}
