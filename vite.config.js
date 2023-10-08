import { defineConfig } from "vite";
import viteCompression from "vite-plugin-compression";

export default defineConfig({
    root: "src/",
    build: {
        outDir: "../dst/",
        emptyOutDir: true,
    },
    preview: {
        port: 8080,
    },
    server: {
        headers: {
            "Content-Security-Policy": "default-src 'none'; script-src 'self'; img-src 'self'; style-src 'self';",
        },
    },
    plugins: [
        viteCompression({
            algorithm: "brotliCompress",
        }),
    ],
});
