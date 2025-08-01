using System.ComponentModel.DataAnnotations;

namespace Server.Source.Models.Scrap.Formula1
{
    public class Formula1StantingRequest
    {
        [Required(ErrorMessage = "Field required")]
        public string Type { get; set; } = string.Empty;

        [Required(ErrorMessage = "Field required")]
        public int Year { get; set; }
    }
}
