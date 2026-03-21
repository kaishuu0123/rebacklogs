import tailwindcss from '@tailwindcss/vite'
import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'
import RubyPlugin from 'vite-plugin-ruby'

export default defineConfig({
  plugins: [
    RubyPlugin(),
    react(),
    tailwindcss(),
  ],
  build: {
    rolldownOptions: {
      output: {
        manualChunks: (id: string) => {
          if (id.includes('node_modules/react/') || id.includes('node_modules/react-dom/')) return 'vendor-react';
          if (id.includes('node_modules/@dnd-kit/')) return 'vendor-dnd';
          if (id.includes('node_modules/@radix-ui/')) return 'vendor-radix';
          if (id.includes('node_modules/@tanstack/')) return 'vendor-query';
          if (id.includes('node_modules/i18next') || id.includes('node_modules/react-i18next')) return 'vendor-i18n';
          if (id.includes('node_modules/lucide')) return 'vendor-lucide';
          if (id.includes('node_modules/@hotwired/')) return 'vendor-turbo';
          if (id.includes('node_modules/date-fns')) return 'vendor-date-fns';
          if (id.includes('node_modules/react-markdown') || id.includes('node_modules/remark') || id.includes('node_modules/rehype') || id.includes('node_modules/unified') || id.includes('node_modules/micromark') || id.includes('node_modules/mdast') || id.includes('node_modules/hast') || id.includes('node_modules/unist')) return 'vendor-markdown';
          if (id.includes('node_modules/')) return 'vendor-misc';
        },
      },
    },
  },
})
