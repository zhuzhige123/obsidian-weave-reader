import path from 'node:path';
import { defineConfig } from 'vitest/config';
import { svelte } from '@sveltejs/vite-plugin-svelte';
import { svelteTesting } from '@testing-library/svelte/vite';

export default defineConfig({
  plugins: [
    svelte({
      compilerOptions: {
        runes: true,
        compatibility: {
          componentApi: 4
        }
      }
    }),
    svelteTesting()
  ],
  test: {
    environment: 'jsdom',
    globals: true,
    clearMocks: true,
    restoreMocks: true,
    fileParallelism: false,
    setupFiles: ['./src/tests/setup.ts', './src/tests/vitest-setup.ts'],
    include: [
      'src/components/epub/**/*.test.ts',
      'src/components/ui/**/*.test.ts',
      'src/components/settings/**/*.test.ts',
      'src/views/**/*.test.ts',
      'src/services/epub/__tests__/**/*.{test,spec}.{js,ts}',
      'src/services/navigation/__tests__/**/*.{test,spec}.{js,ts}',
      'src/utils/__tests__/source-path-matcher.epub-links.test.ts',
      'src/utils/__tests__/yaml-utils.epub-source.test.ts',
      'src/utils/__tests__/license-sync-bridge.test.ts',
      'src/utils/__tests__/license-state.test.ts',
      'src/utils/__tests__/license-owner-email.test.ts',
      'src/utils/__tests__/activation-privacy.test.ts',
      'src/utils/__tests__/plugin-license.test.ts',
      'src/utils/__tests__/license-device-stats.test.ts',
       'src/utils/__tests__/license-validation-lease.test.ts',
       'src/utils/__tests__/license-manager-validation.test.ts',
      'src/utils/__tests__/device-fingerprint.test.ts',
      'src/utils/__tests__/mobile-edit-viewport.test.ts',
      'src/utils/__tests__/mobile-floating-viewport.test.ts',
      'src/utils/__tests__/mobile-reading-viewport-lock.test.ts',
      'src/utils/__tests__/epub-reader-keyboard-guards.test.ts',
      'src/utils/__tests__/dom-instance-of.test.ts',
      'src/utils/__tests__/blob-url-text.test.ts',
      'src/utils/__tests__/clipboard-copy.test.ts',
      'src/utils/__tests__/epub-author-color-sanitizer.test.ts',
      'src/utils/__tests__/i18n-locales.test.ts',
      'src/utils/__tests__/locale-resolver.test.ts',
      'src/services/epub/__tests__/epub-premium-i18n.test.ts',
      'src/services/obsidian/__tests__/**/*.{test,spec}.{js,ts}'
    ],
    exclude: ['node_modules', 'dist'],
    coverage: {
      reporter: ['text', 'json', 'html'],
      exclude: [
        'node_modules/',
        'src/tests/',
        '**/*.d.ts',
        '**/*.config.*',
        '**/demo/**',
        '**/mocks/**'
      ]
    },
    server: {
      deps: {
        inline: ['svelte']
      }
    }
  },
  resolve: {
    alias: {
      '@': '/src',
      'obsidian': '/src/tests/mocks/obsidian.ts',
      'weave-vendor/epubcfi': path.resolve(__dirname, 'vendor/epubcfi.mjs'),
    }
  },
  define: {
    global: 'globalThis'
  }
});
