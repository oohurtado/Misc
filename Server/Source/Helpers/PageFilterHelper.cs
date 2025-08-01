namespace Server.Source.Helpers
{
    public static class PageFilterHelper
    {
        /// <summary>
        /// Ejemplo de un filtro de paginación: "section1:dataA,dataB;section2:dataB,dataC"
        /// </summary>
        /// <param name="filter"></param>
        /// <returns></returns>
        public static List<PageFilter> GetInfo(string filter)
        {
            var pageFilters = new List<PageFilter>();

            var sections = filter.Split(';').ToList();
            foreach (var section in sections)
            {

                var left = section.Split(':')[0];
                var right = section.Split(':')[1];
                pageFilters.Add(new PageFilter()
                {
                    Section = left,
                    Data = right.Split(',').Select(p => p.Trim()).ToList()
                });
            }

            return pageFilters;
        }
    }

    public class PageFilter
    {
        public string Section { get; set; } = string.Empty;
        public List<string> Data { get; set; } = [];
    }
}
