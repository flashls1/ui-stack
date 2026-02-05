import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { resolve } from 'path';

export default defineConfig({
    plugins: [react()],
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
    build: {
        outDir: 'dist',
        sourcemap: false,
    },
    preview: {
        host: '0.0.0.0',
        port: 3000,
        allowedHosts: true,
    },
});
