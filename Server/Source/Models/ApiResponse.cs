namespace Server.Source.Models
{
    public class ApiResponse<T>
    {
        public T Data { get; set; } = default!;
        public int GrandTotal { get; set; } = 0;
        public DateTime TimestampAt { get; set; } = DateTime.UtcNow;

        public bool Success { get; set; } = true;
        public string ErrorMessage { get; set; } = string.Empty;
    }   
}
