import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js'
import { WebStandardStreamableHTTPServerTransport } from '@modelcontextprotocol/sdk/server/webStandardStreamableHttp.js'
import { z } from 'zod'

function createServer() {
  const server = new McpServer({
    name: 'ai-agent',
    version: '1.0.0',
  })

  server.tool(
    'addition',
    'Adds two numbers',
    {
      a: z.number().describe('The first number'),
      b: z.number().describe('The second number'),
    },
    async (params) => {
      return {
        content: [
          {
            type: 'text',
            text: String(params.a + params.b),
          },
        ],
      }
    },
  )

  return server
}

export default {
  async fetch(request: Request) {
    if (new URL(request.url).pathname !== '/mcp') {
      return new Response('Not found', { status: 404 })
    }

    const server = createServer()
    const transport = new WebStandardStreamableHTTPServerTransport({
      sessionIdGenerator: undefined,
      enableJsonResponse: true,
    })

    await server.connect(transport)

    try {
      return await transport.handleRequest(request)
    } finally {
      await transport.close()
      await server.close()
    }
  },
} satisfies ExportedHandler<Env>
