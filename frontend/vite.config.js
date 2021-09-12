import { defineConfig } from "vite";
import { svelte } from "@sveltejs/vite-plugin-svelte";

export default defineConfig({
  server: {
    port: 8000,
    hmr: {
      protocol: 'wss',
      port: 443
    },
  },
  plugins: [svelte({

  })]
});
