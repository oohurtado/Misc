using Microsoft.AspNetCore.Identity;

namespace Server.Source.Models.Entities.Relationships
{
    public class UserEntity : IdentityUser
    {
        /// <summary>
        /// Relationships
        /// </summary>
        
        public PersonalInformationEntity? PersonalInformation { get; set; }

        /// <summary>
        /// Fields
        /// </summary>

        public string FirstName { get; set; } = string.Empty;
        public string LastName { get; set; } = string.Empty;
    }
}
