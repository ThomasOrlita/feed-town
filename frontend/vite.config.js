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
    WindiCSS({
      config: {
        theme: {
          screens: {
            'xs': '425px',
            'sm': '640px',
            'md': '768px',
            'lg': '1024px',
            'xl': '1280px',
            '2xl': '1536px',
          }
        }
      }
    }),
    svelte({

    })]
});
