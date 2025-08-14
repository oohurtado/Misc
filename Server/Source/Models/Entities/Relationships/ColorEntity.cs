namespace Server.Source.Models.Entities.Relationships
{
    public class ColorEntity
    {
        public ColorEntity()
        {
            UserColors = [];
        }

        /// <summary>
        /// Relationships
        /// </summary>

        public int Id { get; set; }
        public ICollection<UserColorEntity> UserColors { get; set; }

        /// <summary>
        /// Fields
        /// </summary>        

        public required string Name { get; set; }
        public required string Code { get; set; }
    }
}
