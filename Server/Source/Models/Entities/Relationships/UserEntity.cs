using Microsoft.AspNetCore.Identity;

namespace Server.Source.Models.Entities.Relationships
{
    public class UserEntity : IdentityUser
    {
        public UserEntity()
        {
            UserColors = [];
            People = [];            
        }

        /// <summary>
        /// Relationships
        /// </summary>

        public PersonalInformationEntity? PersonalInformation { get; set; }
        public ICollection<UserColorEntity> UserColors { get; set; }
        public ICollection<PersonEntity> People { get; set; }

        /// <summary>
        /// Fields
        /// </summary>

        public string FirstName { get; set; } = string.Empty;
        public string LastName { get; set; } = string.Empty;
    }
}
