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

- **calculate_route** -- Driving route between points with real road distances and ETAs. Supports waypoints, encoded polyline geometry, turn-by-turn steps, and up to 3 alternative routes.
- **distance_matrix** -- NxN distance/duration matrix between up to 5000 locations (transparently chunked for large sets, cached for repeated queries).
- **snap_to_road** -- Snap a raw GPS coordinate to the nearest road segment. Returns the snapped point, distance from the original, and road name.
- **isochrone** -- Area reachable from a point within N minutes by car. Returns a GeoJSON Polygon useful for coverage analysis, depot placement, and service area definition.
- **geocode** -- Convert a Brazilian address or place name to latitude/longitude. Restricted to Brazil, in-house geocoder with no third-party dependency. Built-in fuzzy fallback handles abbreviations ("Av" -> "Avenida"), accents, and token drops.
- **geocode_batch** -- Geocode up to 50 addresses in a single call with parallel execution. Perfect for delivery manifests or client lists.
- **reverse_geocode** -- Convert lat/lon to a human-readable Brazilian address with components (road, neighborhood, city, state, postcode).
- **compare_routes** -- Run `optimize_routes` under multiple balance strategies (minimize_vehicles, balance_tasks, minimize_distance) and return a side-by-side comparison with winners per metric.
- **validate_eta** -- Simulate a pre-defined route in Python and return the real arrival times plus any constraint violations. Use when you already have a fixed order of stops and just need the ETAs.
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
  - `matrix_overrides`: user-provided per-pair travel time / distance overrides (for toll routes, restricted zones, known detours)
  - Up to 500 tasks / 250 shipments / 100 vehicles per request
  - Route-level and step-level `violations` reported when constraints are tight

## Example

Ask your AI assistant:

> "Geocode these addresses and optimize 10 deliveries in Sao Paulo for 2 drivers -- the senior finishes each stop in 20 min, the junior in 45 min. Balance tasks evenly, end both at the same warehouse, include the route polylines so I can draw them on a map."

The AI will call `geocode`, then `optimize_routes` with `vehicle.type`, `service_per_type`, `balance_mode`, `end_lat`/`end_lon` and `include_geometry` -- no manual coordinate entry needed.

## What's new in 1.4.1

- **Per-tool analytics**: the dashboard now shows a breakdown of which tools your API key has been calling (horizontal bars, ordered by frequency).
- **80% limit warning**: when your usage crosses 80% of the monthly limit, the dashboard shows a yellow banner reminding you to upgrade before new calls are rejected. `/billing/usage` also exposes `threshold_80` and `threshold_100` flags.
- **Welcome email**: new customers get an onboarding email right after OTP verification, with their API key, ready-to-paste Claude Desktop config, a curl snippet and doc links.

## What's new in 1.4.0

- **`calculate_route` turn-by-turn**: pass `include_steps=true` to get a list of maneuvers with street names, distances and durations per step.
- **`calculate_route` alternatives**: pass `alternatives=1..3` to get alternate routes (useful for "fastest vs shortest vs no-toll" comparisons).
- **Fuzzy geocoding**: `geocode` now silently retries with abbreviation expansion ("Av" -> "Avenida"), accent normalization and token-drop heuristics when the exact query returns nothing. The response includes `variant_used` showing which transformation matched. Set `fuzzy=false` to disable.
- **REST API**: the same 10 tools are now available via plain HTTP POST under `https://routekit.nexterait.com.br/v1/<tool_name>`. Same X-API-Key auth, same metering. The public `GET /v1/` lists all endpoints with their descriptions. Useful for integrations that don't speak MCP.
- **Billing portal return flow**: after managing a subscription on Stripe, the user lands back on the dashboard with a success banner instead of a raw JSON page.

## What's new in 1.3.0

- **`compare_routes`** tool: compare the optimizer under multiple strategies and get winners per metric (distance, travel time, vehicles used). Runs strategies in parallel.
- **`validate_eta`** tool: simulate a pre-defined route and get real ETAs plus violations without re-optimizing. The sequence you provide is strictly respected.
- **`matrix_overrides`** on optimize_routes: patch specific pairs in the distance/time matrix with your own values (toll routes, ferries, known detours) without forcing users to send a whole NxN matrix.

## What's new in 1.2.3

- **`geocode_batch`**: new tool accepting up to 50 addresses per call. Internally runs queries in parallel with bounded concurrency.
- **Mixed-profile fleets**: `optimize_routes` now fetches separate distance/duration matrices per vehicle profile (car/bike/foot). When a profile container isn't deployed, it falls back to car routing transparently.
- **Smarter image check**: the weekly OSRM image check now queries registry tags and ranks stable semver releases (filtering debug/assertions/rc variants).

## What's new in 1.2.2

- **Matrix cache**: repeated distance/duration matrix queries hit a local cache and return ~5x faster. Transparent to callers.
- **Automatic chunking**: distance_matrix now handles up to 5000 locations by splitting into parallel sub-block queries.
- **Retry + backoff**: all upstream calls now retry transient failures (connect errors, 5xx) with exponential backoff + jitter before surfacing an error.
- **Cleaner error messages**: "temporarily unavailable" vs "no result found" so the LLM can decide whether to retry.

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
