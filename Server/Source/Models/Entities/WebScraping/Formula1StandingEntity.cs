namespace Server.Source.Models.Entities.WebScraping
{
    public class Formula1StandingEntity
    {
        public int Id { get; set; }

        public string Type { get; set; } = null!;
        public int Year { get; set; }
        public string DataJson { get; set; } = null!; // Formula1StandingScrap
        public DateTime EventAt { get; set; }
    }
}
