import { defineConfig } from 'vite';
import viteCompression from 'vite-plugin-compression';
import handlebars from 'vite-plugin-handlebars';
import browserslist from 'browserslist';
import { browserslistToTargets } from 'lightningcss';
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

// Self-host Decap CMS instead of loading it from the unpkg CDN. The prebuilt
// bundle lazy-loads webpack chunks from its own directory, so we copy the whole
// dist/ (JS only — the source maps are ~50 MB) into admin/decap/ and strip the
// sourceMappingURL comments so browsers don't 404 on the omitted maps.
function vendorDecapPlugin() {
  let outDir;
  return {
    name: 'vendor-decap',
    apply: 'build',
    configResolved(config) {
      outDir = path.resolve(config.root, config.build.outDir);
    },
    closeBundle() {
      const srcDir = path.resolve('node_modules/decap-cms/dist');
      const destDir = path.resolve(outDir, 'admin/decap');
      fs.mkdirSync(destDir, { recursive: true });
      for (const file of fs.readdirSync(srcDir)) {
        if (!file.endsWith('.js')) continue; // skip .map files
        const code = fs
          .readFileSync(path.join(srcDir, file), 'utf8')
          .replace(/\n?\/\/# sourceMappingURL=.*$/, '');
        fs.writeFileSync(path.join(destDir, file), code);
      }
    },
  };
}

export default defineConfig({
  root: 'src/',
  base: './',
  css: {
    // Lightning CSS handles autoprefixing + minification in one pass, driven
    // by the `browserslist` field in package.json. Replaces the former
    // PostCSS pipeline (autoprefixer + cssnano + preset-env).
    transformer: 'lightningcss',
    lightningcss: {
      targets: browserslistToTargets(browserslist()),
    },
  },
  build: {
    outDir: '../dst/',
    emptyOutDir: true,
    cssMinify: 'lightningcss',
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
    vendorDecapPlugin(),
    viteCompression({
      algorithm: 'brotliCompress',
    }),
  ],
});
