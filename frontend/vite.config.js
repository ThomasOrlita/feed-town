import { defineConfig } from "vite";
import WindiCSS from 'vite-plugin-windicss';
import { svelte } from "@sveltejs/vite-plugin-svelte";

export default defineConfig({
  server: {
    port: 8000,
    hmr: {
      protocol: 'wss',
      port: 443
    },
  },
  plugins: [
    WindiCSS(),
    svelte({

    })]
});
