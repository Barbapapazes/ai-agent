import { createOpenAI } from '@ai-sdk/openai'
import { StreamableHTTPClientTransport } from '@modelcontextprotocol/sdk/client/streamableHttp.js'
import { convertToModelMessages, experimental_createMCPClient, stepCountIs, streamText } from 'ai'
import { defineEventHandler, defineLazyEventHandler, readBody } from 'h3'
import { useRuntimeConfig } from 'nitropack/runtime'

export default defineLazyEventHandler(() => {
  const runtimeConfig = useRuntimeConfig()

  const model = createOpenAI({
    apiKey: runtimeConfig.openAiApiKey,
  })

  return defineEventHandler(async (event) => {
    const { messages } = await readBody(event)

    const httpTransport = new StreamableHTTPClientTransport(
      new URL(runtimeConfig.mcpEndpoint)
    )
    const httpClient = await experimental_createMCPClient({
      transport: httpTransport
    })
    const tools = await httpClient.tools()

    return streamText({
      model: model('gpt-5-nano'),
      system: `You are a helpful assistant. You can use the tool to add two numbers together.`,
      stopWhen: stepCountIs(2),
      tools,
      messages: convertToModelMessages(messages),
    }).toUIMessageStreamResponse()
  })
})
