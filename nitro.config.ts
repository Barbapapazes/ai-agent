import { defineNitroConfig } from "nitropack/config"

export default defineNitroConfig({
  runtimeConfig: {
    openAiApiKey: '',
    mcpEndpoint: '',
  },
  compatibilityDate: "latest",
  srcDir: "server",
  imports: false,
});
