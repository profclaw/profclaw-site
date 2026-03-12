import { defineConfig } from 'astro/config';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig({
  site: 'https://profclaw.ai',
  output: 'static',
  server: {
    port: 6001,
    host: true,
  },
  vite: {
    plugins: [tailwindcss()],
  },
  build: {
    assets: 'assets',
  },
});
