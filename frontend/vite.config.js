import { defineConfig } from "vite";
import { svelte } from "@sveltejs/vite-plugin-svelte";

export default defineConfig({
  server: {
    hmr: {
      protocol: 'wss',
      port: 443
    },
  },
  plugins: [svelte({

  })]
});
