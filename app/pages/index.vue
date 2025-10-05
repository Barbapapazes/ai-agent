<script setup lang="ts">
import { Chat } from '@ai-sdk/vue'

const input = ref('')

const chat = new Chat({
  onError(error) {
    console.error('Chat error:', error)
  }
})

const handleSubmit = (e: Event) => {
  e.preventDefault()
  chat.sendMessage({ text: input.value })
  input.value = ''
}
</script>

<template>
  <UDashboardPanel>
    <template #body>
      <UContainer>
        <UChatMessages :messages="chat.messages" :status="chat.status">
          <template #content="{ message }">
            <template v-for="(part, index) in message.parts" :key="index">
              <MDC v-if="part.type === 'text'" :value="part.text" :cache-key="message.id + '-' + index" unwrap="p" />
              <div v-else-if="part.type === 'reasoning'"> {{ part.state === 'streaming' ? 'Thinking...' : 'Thinking complete' }} </div>
                <div v-else-if="part.type === 'dynamic-tool' && part.toolName === 'addition'">
                <template v-if="part.state === 'input-streaming'">
                  <template v-if="part.input && (part.input as { a: number, b: number }).a !== undefined && (part.input as { a: number, b: number }).b !== undefined">
                  Adding: {{ (part.input as { a: number, b: number }).a }} + {{ (part.input as { a: number, b: number }).b }}
                  </template>
                  <template v-else>
                  Adding...
                  </template>
                </template>
                <template v-else>
                  Addition complete: {{ (part.input as { a: number, b: number }).a }} + {{ (part.input as { a: number, b: number }).b }}
                </template>
                </div>
            </template>
          </template>
        </UChatMessages>
      </UContainer>
    </template>

    <template #footer>
      <UContainer>
        <UChatPrompt v-model="input" :error="chat.error" @submit="handleSubmit">
          <UChatPromptSubmit :status="chat.status" @stop="chat.stop" @reload="chat.regenerate" />
        </UChatPrompt>
      </UContainer>
    </template>
  </UDashboardPanel>
</template>
