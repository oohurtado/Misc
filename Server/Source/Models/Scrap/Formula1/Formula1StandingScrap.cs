namespace Server.Source.Models.Scrap.Formula1
{
    public class Formula1StandingScrap
    {
        public List<Formula1StandingScrap_Column> Columns { get; set; } = [];
        public List<string> Rows { get; set; } = [];
        public List<List<string>> Points { get; set; } = [];
    }    

    public class Formula1StandingScrap_Column
    {
        public string Name { get; set; } = string.Empty;
        public string Position { get; set; } = string.Empty;
        public string Image { get; set; } = string.Empty;
        public string Abbreviation { get; set; } = string.Empty;
    }
}
