import { defineNitroConfig } from "nitropack/config"

export default defineNitroConfig({
  runtimeConfig: {
    openAiApiKey: '',
  },
  compatibilityDate: "latest",
  srcDir: "server",
  imports: false,
});
