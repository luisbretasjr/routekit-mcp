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
- **snap_to_road** -- Snap a raw GPS coordinate to the nearest road segment. Returns the snapped point, distance from the original, and road name.
- **isochrone** -- Area reachable from a point within N minutes by car. Returns a GeoJSON Polygon useful for coverage analysis, depot placement, and service area definition.
- **geocode** -- Convert a Brazilian address or place name to latitude/longitude. Restricted to Brazil, in-house geocoder with no third-party dependency.
- **reverse_geocode** -- Convert lat/lon to a human-readable Brazilian address with components (road, neighborhood, city, state, postcode).
- **optimize_routes** -- Advanced VRP solver:
  - `tasks` (single-location jobs) and/or `shipments` (paired pickup+delivery, same vehicle)
  - Constraints: time windows (multiple per task), skills, multi-dimensional capacity, breaks, priorities
  - Per-vehicle costs (`fixed`, `per_hour`, `per_km`, `per_task_hour`), `max_tasks`, `max_travel_time_min`, `max_distance_km`
  - `balance_mode`: `minimize_vehicles` (default), `balance_tasks`, or `minimize_distance`
  - `setup_min` separate from `service_min` (setup charged once per location)
  - `setup_per_type` / `service_per_type` for different times per technician/vehicle type
  - `vehicle.type` tags for per-type time/cost modeling
  - `end_lat` / `end_lon` for open routes with different destination (e.g. driver ends at home)
  - Mixed-profile fleets (car / bike / foot) with per-vehicle `profile`
  - `include_geometry=true` returns encoded polylines per route (for maps)
  - Up to 500 tasks / 250 shipments / 100 vehicles per request
  - Route-level and step-level `violations` reported when constraints are tight

## Example

Ask your AI assistant:

> "Geocode these addresses and optimize 10 deliveries in Sao Paulo for 2 drivers -- the senior finishes each stop in 20 min, the junior in 45 min. Balance tasks evenly, end both at the same warehouse, include the route polylines so I can draw them on a map."

The AI will call `geocode`, then `optimize_routes` with `vehicle.type`, `service_per_type`, `balance_mode`, `end_lat`/`end_lon` and `include_geometry` -- no manual coordinate entry needed.

## What's new in 1.2.0

- **Geocoding**: new `geocode` and `reverse_geocode` tools for Brazil. Users can speak in addresses instead of coordinates. No third-party API dependency.
- **Snap-to-road**: new `snap_to_road` tool to clean up noisy GPS before routing.
- **Isochrone**: new `isochrone` tool to compute areas reachable in N minutes.
- **Technician modeling**: `vehicle.type`, `setup_per_type`, `service_per_type`, `costs.per_task_hour` for per-type time and cost realism.
- **Open routes**: `end_lat`/`end_lon` per vehicle for drivers that end at a different place than they started.
- **Multi-profile fleets**: label vehicles with `profile` (car/bike/foot/truck).

## What's new in 1.1.0

- `shipments` (paired pickup+delivery) support
- `balance_mode` to distribute tasks evenly across a fleet
- `include_geometry` to return route polylines from the optimizer
- Route `violations` now surfaced in the response for diagnosis
- `setup_min` vs `service_min` split for realistic location costs
- Matrix limit raised from 200 to 2000 locations
- Advanced VRP engine upgrade: `per_km` costs and `max_distance_km` constraints now active

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
