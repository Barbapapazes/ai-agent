import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js'
import { McpAgent } from 'agents/mcp'
import { z } from 'zod/v3'

export class OurMcp extends McpAgent {
  server = new McpServer({
      name: 'ai-agent',
      version: '1.0.0'
  })

  async init() {
    this.server.tool (
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
    })
  }
}

export default {
  fetch(request: Request, env: Env, ctx: ExecutionContext) {
    return OurMcp.serve('/').fetch(request, env, ctx)
  },
}
