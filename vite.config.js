import { defineConfig } from "vite";
import viteCompression from "vite-plugin-compression";
import handlebars from "vite-plugin-handlebars";
import yaml from "js-yaml";
import fs from "fs";

const content = yaml.load(
  fs.readFileSync("src/_data/content.yaml", "utf8")
);

export default defineConfig({
  root: "src/",
  base: "./",
  build: {
    outDir: "../dst/",
    emptyOutDir: true,
  },
  preview: {
    port: 8080,
  },
  plugins: [
    handlebars({
      context: content,
      helpers: {
        tel: (phone) => String(phone).replace(/^0/, "+44"),
      },
    }),
    viteCompression({
      algorithm: "brotliCompress",
    }),
  ],
});
