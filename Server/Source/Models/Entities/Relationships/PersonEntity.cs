namespace Server.Source.Models.Entities.Relationships
{
    public class PersonEntity
    {
        /// <summary>
        /// Relationships
        /// </summary>
        
        public int Id { get; set; }
        public required string UserId { get; set; }
        public required UserEntity User { get; set; }

        /// <summary>
        /// Fields
        /// </summary>     

        public string? FirstName { get; set; }
        public string? LastName { get; set; }
        public string? Nickname { get; set; }
        public DateTime? Birthdate { get; set; }
        public string? PhoneNumber { get; set; }
        public string? Email { get; set; }
        public string? Notes { get; set; }
    }
}
