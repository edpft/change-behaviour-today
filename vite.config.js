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
  plugins: [
    viteCompression({
      algorithm: "brotliCompress",
    }),
  ],
});
