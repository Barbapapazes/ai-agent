import { streamText, convertToModelMessages, tool, stepCountIs } from 'ai'
import { createOpenAI } from '@ai-sdk/openai'
import { defineEventHandler, readBody, defineLazyEventHandler } from 'h3'
import { useRuntimeConfig } from 'nitropack/runtime'
import { z } from 'zod'

export default defineLazyEventHandler(() => {
  const runtimeConfig = useRuntimeConfig()

  const model = createOpenAI({
    apiKey: runtimeConfig.openAiApiKey,
  })

  return defineEventHandler(async (event) => {
    const { messages } = await readBody(event)

    return streamText({
      model: model('gpt-5-nano'),
      system: `You are a helpful assistant. You can use the tool to add two numbers together.`,
      tools: {
        addition: tool({
          description: 'Adds two numbers',
          inputSchema: z.object({
            a: z.number().describe('The first number'),
            b: z.number().describe('The second number'),
          }),
          execute: ({ a, b }) => ({
            a,
            b,
            result: a + b
          }),
        }),
      },
      stopWhen: stepCountIs(2),
      messages: convertToModelMessages(messages),
    }).toUIMessageStreamResponse()
  })
})
