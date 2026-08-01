import { defineConfig, type Plugin } from 'vite'
import react from '@vitejs/plugin-react'

// Plugin: make Vite-injected CSS non-blocking by using media=print trick
function asyncCssPlugin(): Plugin {
  return {
    name: 'async-css',
    apply: 'build',
    transformIndexHtml(html: string) {
      // Convert Vite-injected stylesheet links to async
      return html.replace(
        /<link rel="stylesheet"([^>]*?)href="([^"]*\.css)"([^>]*?)>/g,
        (_, before, href, after) => {
          // Skip fonts (already handled)
          if (href.includes('fonts.googleapis.com')) return _;
          return `<link rel="preload" as="style" href="${href}"${before}${after} onload="this.rel='stylesheet'"><noscript><link rel="stylesheet" href="${href}"${before}${after}></noscript>`;
        }
      );
    },
  };
}

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), asyncCssPlugin()],
  build: {
    target: 'esnext',
    cssCodeSplit: false,
    cssMinify: true,
    minify: 'esbuild',
    assetsInlineLimit: 4096,
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes('node_modules/react') || id.includes('node_modules/react-dom')) {
            return 'react';
          }
          if (id.includes('node_modules/@supabase')) {
            return 'supabase';
          }
          if (id.includes('node_modules/lucide-react')) {
            return 'icons';
          }
        },
      },
    },
  },
})
