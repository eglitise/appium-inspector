import { defineConfig, externalizeDepsPlugin } from 'electron-vite';
import react from '@vitejs/plugin-react';
import renderer from 'vite-plugin-electron-renderer';

export default defineConfig({
  main: {
    build: {
      lib: {
        entry: 'app/main/main.js',
      }
    },
    plugins: [externalizeDepsPlugin()],
  },
  preload: {
    build: {
      lib: {
        entry: 'app/preload/preload.js',
      }
    },
    plugins: [externalizeDepsPlugin()],
  },
  renderer: {
    build: {
      rollupOptions: {
        input: 'app/renderer/index.html',
      },
    },
    css: {
      preprocessorOptions: {
        less: {
          javascriptEnabled: true,
          additionalData: '@root-entry-name: default;',
        },
      },
    },
    plugins: [react(), renderer()],
    root: 'app/renderer',
  },
});
