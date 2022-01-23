import { defineConfig } from "vite";
import WindiCSS from 'vite-plugin-windicss';
import { svelte } from '@sveltejs/vite-plugin-svelte';
import tsconfigPaths from 'vite-tsconfig-paths';

export default defineConfig({
  server: {
    port: 8000,
    hmr: {
      protocol: 'wss',
      port: 443
    },
  },
  plugins: [
    tsconfigPaths(),
    WindiCSS(),
    svelte({

    })]
});
