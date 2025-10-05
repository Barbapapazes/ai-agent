import { defineEventHandler, readBody } from "h3";
import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js'
import { StreamableHTTPServerTransport } from '@modelcontextprotocol/sdk/server/streamableHttp.js'
import { z } from 'zod/v3'

export default defineEventHandler(async (event) => {
  const server = new McpServer({
    name: 'ai-agent',
    version: '1.0.0'
  })

  server.tool (
    'addition',
    'Adds two numbers',
    {
      a: z.number().describe('The first number'),
      b: z.number().describe('The second number')
    },
    async (params) => {
      return {
        content: [
          {
            type: 'text',
            text: String(params.a + params.b)
          }
        ]
      }
    }
  )

  const transport: StreamableHTTPServerTransport = new StreamableHTTPServerTransport({
    sessionIdGenerator: undefined
  })

  event.node.res.on('close', () => {
    transport.close()
    server.close()
  })

  await server.connect(transport)

  const body = await readBody(event)

  await transport.handleRequest(event.node.req, event.node.res, body)
})
