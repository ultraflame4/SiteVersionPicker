import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import legacy from '@vitejs/plugin-legacy'
import tailwindcss from '@tailwindcss/vite'
import path from 'node:path'
// https://vitejs.dev/config/
export default defineConfig({
    plugins: [
        vue(),
        legacy(),
        tailwindcss()
    ],
    resolve: {
        alias: {
            '@': path.resolve(__dirname, './src'),
        },
    },
    base: "/SiteVersionPicker",
})
