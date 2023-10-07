import { defineConfig } from 'vite'
import viteCompression from 'vite-plugin-compression';

export default defineConfig({
    root: "src/",
    build: {
        outDir: "../dst/",
        emptyOutDir: true
    },
    preview: {
        port: 8080,
    },
    server: {
        headers: {
            'Content-Security-Policy': "script-src 'none'; object-src 'none'; base-uri 'none';",
          },
    },
    plugins: [
        viteCompression({
            algorithm: 'brotliCompress',
        }),
    ]
})