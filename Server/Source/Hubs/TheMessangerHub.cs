using Microsoft.AspNetCore.SignalR;
using System.Collections.Concurrent;

namespace Server.Source.Hubs
{
    public class TheMessangerHub : Hub
    {        
        private static readonly ConcurrentDictionary<string, string> _userConnections = new();

        // Client connects
        public override async Task OnConnectedAsync()
        {
            var userId = Context.User?.Identity?.Name ?? "anon-" + Guid.NewGuid().ToString()[..8];
            var connectionId = Context.ConnectionId;

            _userConnections[userId] = connectionId; // Guardar relación
            await Clients.Client(connectionId).SendAsync("ReceiveConnectionId", connectionId);
            await base.OnConnectedAsync();
        }

        // Client disconnects
        public override async Task OnDisconnectedAsync(Exception? exception)
        {
            var userId = _userConnections.FirstOrDefault(x => x.Value == Context.ConnectionId).Key;
            if (userId != null) _userConnections.TryRemove(userId, out _);
            await base.OnDisconnectedAsync(exception);
        }
    }
}
