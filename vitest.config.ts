import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';
import { resolve } from 'path';

export default defineConfig({
    plugins: [react()],
    test: {
        globals: true,
        environment: 'jsdom',
        setupFiles: ['./vitest.setup.ts'],
        include: ['**/*.{test,spec}.{ts,tsx}'],
        exclude: ['node_modules', 'dist', '.storybook'],
        coverage: {
            provider: 'v8',
            reporter: ['text', 'json', 'html'],
            include: ['components/**/*.tsx', 'animations/**/*.tsx', 'patterns/**/*.tsx', 'react-bits/**/*.tsx'],
            exclude: ['**/*.stories.tsx', '**/*.test.tsx', '**/index.ts'],
        },
        css: true,
    },
    resolve: {
        alias: {
            '@': resolve(__dirname, './'),
            '@components': resolve(__dirname, './components'),
            '@animations': resolve(__dirname, './animations'),
            '@patterns': resolve(__dirname, './patterns'),
            '@react-bits': resolve(__dirname, './react-bits'),
            '@tokens': resolve(__dirname, './tokens'),
        },
    },
});
