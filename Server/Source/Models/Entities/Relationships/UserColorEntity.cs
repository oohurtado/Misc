namespace Server.Source.Models.Entities.Relationships
{
    public class UserColorEntity
    {
        /// <summary>
        /// Relationships
        /// </summary>

        public int Id { get; set; }
        public required string UserId { get; set; }
        public required UserEntity User { get; set; }
        public required int ColorId { get; set; }
        public required ColorEntity Color { get; set; }


        /// <summary>
        /// Fields
        /// </summary>

        public int LikePercentage { get; set; }
    }
}
