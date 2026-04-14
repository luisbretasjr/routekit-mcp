#!/usr/bin/env node

/**
 * RouteKit MCP -- Stdio proxy to remote RouteKit server.
 * Connects to https://routekit.nexterait.com.br/mcp via Streamable HTTP
 * and exposes tools locally via stdio transport.
 *
 * Usage:
 *   ROUTEKIT_API_KEY=your_key npx routekit-mcp
 */

import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { Client } from "@modelcontextprotocol/sdk/client/index.js";
import { StreamableHTTPClientTransport } from "@modelcontextprotocol/sdk/client/streamableHttp.js";
import {
  CallToolRequestSchema,
  ListToolsRequestSchema,
} from "@modelcontextprotocol/sdk/types.js";

const REMOTE_URL = "https://routekit.nexterait.com.br/mcp";
const API_KEY = process.env.ROUTEKIT_API_KEY;

if (!API_KEY) {
  process.stderr.write(
    "Error: ROUTEKIT_API_KEY environment variable is required.\n" +
    "Get a free key at https://routekit.nexterait.com.br/static/signup.html\n"
  );
  process.exit(1);
}

async function main() {
  // Connect to remote RouteKit server
  const httpTransport = new StreamableHTTPClientTransport(
    new URL(REMOTE_URL),
    {
      requestInit: {
        headers: {
          "X-API-Key": API_KEY!,
        },
      },
    }
  );

  const client = new Client(
    { name: "routekit-proxy", version: "1.2.1" },
    { capabilities: {} }
  );

  await client.connect(httpTransport);

  // Expose via stdio
  const server = new Server(
    { name: "routekit-mcp", version: "1.2.1" },
    { capabilities: { tools: {} } }
  );

  server.setRequestHandler(ListToolsRequestSchema, async () => {
    return await client.listTools();
  });

  server.setRequestHandler(CallToolRequestSchema, async (request) => {
    return await client.callTool({
      name: request.params.name,
      arguments: request.params.arguments || {},
    });
  });

  const stdioTransport = new StdioServerTransport();
  await server.connect(stdioTransport);
}

main().catch((err) => {
  process.stderr.write(`RouteKit MCP error: ${err.message}\n`);
  process.exit(1);
});
