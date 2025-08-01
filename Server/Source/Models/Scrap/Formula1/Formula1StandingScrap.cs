namespace Server.Source.Models.Scrap.Formula1
{
     public class Formula1StandingScrap
    {        
        public List<string> RaceTacks { get; set; } = [];
        public List<Formula1Standing_ColumnLabel>? ColumnLabels { get; set; }
        public List<Formula1Standing_RowLabel>? RowLabels { get; set; }
    }

    public class Formula1Standing_ColumnLabel
    {
        public string Position { get; set; } = string.Empty;
        public string Image { get; set; } = string.Empty;
        public string Abbreviation { get; set; } = string.Empty;
        public string Name { get; set; } = string.Empty;
    }

    public class Formula1Standing_RowLabel
    {
        public List<string> Points { get; set; } = [];
    }
}
