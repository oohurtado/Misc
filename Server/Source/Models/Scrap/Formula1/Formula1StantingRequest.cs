using System.ComponentModel.DataAnnotations;

namespace Server.Source.Models.Scrap.Formula1
{
    public class Formula1StantingRequest : IValidatableObject
    {
        [Required(ErrorMessage = "Field required")]
        public string ConnectionId { get; set; } = string.Empty;

        [Required(ErrorMessage = "Field required")]
        public string Type { get; set; } = string.Empty;

        [Required(ErrorMessage = "Field required")]
        public int Year { get; set; }

        public IEnumerable<ValidationResult> Validate(ValidationContext validationContext)
        {
            if (Year > DateTime.Now.Year)
            {
                yield return new ValidationResult("Year cannot be in the future.", new[] { nameof(Year) });
            }
            if (Year < 2001)
            {
                yield return new ValidationResult("Year must be a valid integer greater than or equal to 2001.", new[] { nameof(Year) });
            }
            if (Type != "drivers" && Type != "constructors")
            {
                yield return new ValidationResult("Type must be either 'drivers' or 'constructors'.", new[] { nameof(Type) });
            }
        }     
    }
}
