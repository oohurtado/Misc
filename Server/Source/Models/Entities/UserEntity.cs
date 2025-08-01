using Microsoft.AspNetCore.Identity;

namespace Server.Source.Models.Entities
{
    public class UserEntity : IdentityUser
    {
        public string FirstName { get; set; } = string.Empty;
        public string LastName { get; set; } = string.Empty;
    }
}
