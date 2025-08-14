namespace Server.Source.Models.Entities.Relationships
{
    public class PersonalInformationEntity
    {
        /// <summary>
        /// Relationships
        /// </summary>
        
        public int Id { get; set; }
        public string UserId { get; set; } = null!;
        public UserEntity User { get; set; } = null!;

        /// <summary>
        /// Fields
        /// </summary>

        public DateTime? Birthdate { get; set; }
        public string? Gender { get; set; }
        public string? MartialStatus { get; set; }
        public string? CountryOfBirth { get; set; }
        public string? StateOfBirth { get; set; }
        public string? CityOfBirth { get; set; }
        public string? Picture { get; set; }
    }
}
