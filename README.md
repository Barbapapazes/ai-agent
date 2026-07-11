# AI Agent and MCP Server

Companion project for the [AI Agents and MCP Server: Teaming Up for the Agentic Web](https://soubiran.dev/series/ai-agents-and-mcp-server-teaming-up-for-the-agentic-web) series. It contains a Nuxt chat application, an AI SDK agent, and a stateless Cloudflare Worker MCP server exposing an `addition` tool.

## Setup

Copy `.env.example` to `.env`, then set `NUXT_OPEN_AI_API_KEY`. The default `NUXT_MCP_ENDPOINT` points to the local Worker endpoint at `http://localhost:8787/mcp`.

Start the MCP server and the Nuxt application in separate terminals:

```text
pnpm dev:wrangler
pnpm dev
```

Open the Nuxt app, then ask the agent to add two numbers. The agent discovers the Worker tool using MCP and streams its response back to the chat interface.

## Cloudflare deployment

Deploy the MCP Worker with `pnpm deploy:wrangler`. Deploy the Nuxt application with the Cloudflare Pages preset, and configure `NUXT_OPEN_AI_API_KEY` plus `NUXT_MCP_ENDPOINT` in the Pages project. Set the latter to the deployed Worker URL followed by `/mcp`.
