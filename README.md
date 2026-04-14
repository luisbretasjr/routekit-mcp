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

- **calculate_route** -- Driving route between points with real road distances and ETAs. Supports waypoints and encoded polyline geometry.
- **distance_matrix** -- NxN distance/duration matrix between up to 2000 locations.
- **optimize_routes** -- VRP solver powered by VROOM 1.15:
  - `tasks` (single-location jobs) and/or `shipments` (paired pickup+delivery, same vehicle)
  - Constraints: time windows (multiple per task), skills, multi-dimensional capacity, breaks, priorities
  - Per-vehicle costs (`fixed`, `per_hour`, `per_km`), `max_tasks`, `max_travel_time_min`, `max_distance_km`
  - `balance_mode`: `minimize_vehicles` (default), `balance_tasks`, or `minimize_distance`
  - `setup_min` separate from `service_min` (setup charged once per location)
  - `include_geometry=true` returns encoded polylines per route (for maps)
  - Up to 500 tasks / 250 shipments / 100 vehicles per request
  - Route-level and step-level `violations` reported when constraints are tight

## Example

Ask your AI assistant:

> "Optimize 10 deliveries in Sao Paulo for 2 drivers, balance tasks evenly, with lunch break at noon, include the route polylines so I can draw them on a map."

The AI will call `optimize_routes` and return optimized routes with real road distances, balanced across drivers, with geometry ready to render.

## What's new in 1.1.0

- `shipments` (paired pickup+delivery) support
- `balance_mode` to distribute tasks evenly across a fleet
- `include_geometry` to return route polylines from the optimizer
- Route `violations` now surfaced in the response for diagnosis
- `setup_min` vs `service_min` split for realistic location costs
- Matrix limit raised from 200 to 2000 locations
- VROOM upgraded to 1.15.0: `per_km` costs and `max_distance_km` constraints now active

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
