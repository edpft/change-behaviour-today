import { defineConfig } from 'vite';
import viteCompression from 'vite-plugin-compression';
import handlebars from 'vite-plugin-handlebars';
import yaml from 'js-yaml';
import fs from 'fs';
import path from 'path';

const content = yaml.load(fs.readFileSync('src/_data/content.yaml', 'utf8'));

// Inline the generated CSS into a <style> tag so the stylesheet is never
// render-blocking. The CSS is small (~9 KB) so inlining is fine.
function inlineCssPlugin() {
  let outDir;
  return {
    name: 'inline-css',
    apply: 'build',
    configResolved(config) {
      outDir = path.resolve(config.root, config.build.outDir);
    },
    closeBundle() {
      const htmlPath = path.resolve(outDir, 'index.html');
      let html = fs.readFileSync(htmlPath, 'utf8');
      const match = html.match(
        /<link rel="stylesheet"[^>]+href="([^"]+)"[^>]*>/,
      );
      if (!match) return;
      const cssPath = path.resolve(outDir, match[1].replace(/^\.\//, ''));
      if (!fs.existsSync(cssPath)) return;
      // Re-base relative URLs — in the emitted CSS file they resolve from
      // assets/, but after inlining they resolve from the HTML root. So a
      // hashed asset `./x` (in assets/) becomes `./assets/x`, and a public
      // asset `../fonts/x` (one level up from assets/) becomes `./fonts/x`.
      const css = fs
        .readFileSync(cssPath, 'utf8')
        .replace(/url\(\.\/(?!assets\/)/g, 'url(./assets/')
        .replace(/"\.\/(?!assets\/)/g, '"./assets/')
        .replace(/url\(\.\.\//g, 'url(./')
        .replace(/"\.\.\//g, '"./');
      html = html.replace(match[0], `<style>${css}</style>`);
      fs.writeFileSync(htmlPath, html);
    },
  };
}

export default defineConfig({
  root: 'src/',
  base: './',
  build: {
    outDir: '../dst/',
    emptyOutDir: true,
  },
  preview: {
    port: 8080,
  },
  plugins: [
    handlebars({
      context: content,
      helpers: {
        tel: (phone) => String(phone).replace(/^0/, '+44'),
      },
    }),
    inlineCssPlugin(),
    viteCompression({
      algorithm: 'brotliCompress',
    }),
  ],
});
