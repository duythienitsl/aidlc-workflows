import path from 'path';
import { fileURLToPath } from 'url';

import { playwright } from '@vitest/browser-playwright';
import react from '@vitejs/plugin-react-swc';
import { defineConfig } from 'vitest/config';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const reactAlias = {
  '@': path.resolve(__dirname, './src'),
  react: path.resolve(__dirname, 'node_modules/react'),
  'react-dom': path.resolve(__dirname, 'node_modules/react-dom'),
};

const unitInlineDeps = [
  '@testing-library/dom',
  '@testing-library/react',
  'react',
  'react-dom',
  'react-router',
  'react-router-dom',
];

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: reactAlias,
    dedupe: ['react', 'react-dom'],
  },
  css: {
    postcss: './postcss.config.js',
  },
  server: {
    port: 5173,
    strictPort: true,
  },
  preview: {
    port: 5173,
  },
  test: {
    projects: [
      {
        resolve: {
          alias: reactAlias,
          dedupe: ['react', 'react-dom'],
        },
        test: {
          name: 'unit',
          clearMocks: true,
          environment: 'jsdom',
          include: ['src/**/*.{test,spec}.{ts,tsx}'],
          exclude: ['src/**/*.browser.spec.ts', 'src/**/*.browser.spec.tsx'],
          server: {
            deps: {
              inline: unitInlineDeps,
            },
          },
          setupFiles: ['./vitest.setup.ts'],
        },
      },
      {
        resolve: {
          alias: reactAlias,
          dedupe: ['react', 'react-dom'],
        },
        optimizeDeps: {
          include: ['vitest-browser-react', 'react/jsx-dev-runtime'],
        },
        test: {
          name: 'browser',
          include: ['src/**/*.browser.spec.ts', 'src/**/*.browser.spec.tsx'],
          setupFiles: ['./vitest.browser.setup.ts'],
          browser: {
            enabled: true,
            headless: process.env.CI === 'true',
            instances: [{ browser: 'chromium' }],
            provider: playwright(),
          },
        },
      },
    ],
  },
});
