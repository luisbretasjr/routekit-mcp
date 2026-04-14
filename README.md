# RouteKit MCP

<!-- mcp-name: io.github.luisbretasjr/routekit -->

Route optimization API for Brazil. First MCP server for route optimization.

## Install

```bash
npx routekit-mcp
```

Or configure in your MCP client:

### Claude Desktop / Claude Code

```json
{
  "mcpServers": {
    "routekit": {
      "command": "npx",
      "args": ["-y", "routekit-mcp"],
      "env": {
        "ROUTEKIT_API_KEY": "YOUR_KEY"
      }
    }
  }
}
```

### Direct HTTP (no install needed)

```json
{
  "mcpServers": {
    "routekit": {
      "type": "url",
      "url": "https://routekit.nexterait.com.br/mcp",
      "headers": {
        "X-API-Key": "YOUR_KEY"
      }
    }
  }
}
```

## Get API Key

Get a free key (50 calls/month) at [routekit.nexterait.com.br/static/signup.html](https://routekit.nexterait.com.br/static/signup.html)

## Tools

- **calculate_route** -- Driving route between points with real road distances and ETAs
- **distance_matrix** -- NxN distance/duration matrix between up to 200 locations
- **optimize_routes** -- VRP solver: assign tasks to vehicles, optimize sequences, respect time windows, skills, capacity, breaks (up to 500 tasks)

## Example

Ask your AI assistant:

> "Optimize 10 deliveries in Sao Paulo for 2 drivers, with lunch break at noon"

The AI will call `optimize_routes` and return optimized routes with real road distances.

## Pricing

| Tier | Calls/Month | Price |
|------|-------------|-------|
| Free | 50 | R$ 0 |
| Starter | 1,000 | R$ 500/month |
| Professional | 10,000 | R$ 3,000/month |

## Links

- [Website](https://routekit.nexterait.com.br)
- [API Docs](https://routekit.nexterait.com.br/static/docs.html)
- [User Guide](https://routekit.nexterait.com.br/static/guide.html)
- [Dashboard](https://routekit.nexterait.com.br/static/dashboard.html)

## Provider

[Nextera IT Solutions](https://nexterait.com.br)
