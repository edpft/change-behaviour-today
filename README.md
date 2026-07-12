# Change Behaviour Today

Marketing website for Sarah Fawcett, a Cognitive Behavioural Therapist —
<https://www.changebehaviourtoday.co.uk>.

It's a single static page built from a Handlebars template and a YAML content
file, editable through a self-hosted [Decap CMS](https://decapcms.org/) admin,
and deployed to Netlify.

## Tech stack

| Concern      | Tool                                                      |
| ------------ | --------------------------------------------------------- |
| Build        | [Vite](https://vite.dev/)                                 |
| Templating   | Handlebars (`vite-plugin-handlebars`)                     |
| Styles       | SCSS compiled by Vite, minified/prefixed by Lightning CSS |
| Content      | `src/_data/content.yaml`                                  |
| CMS          | Decap CMS + Netlify Identity / git-gateway (`/admin`)     |
| Images       | `sharp` (`process-images.js`) → AVIF/WebP/JPEG            |
| Hosting      | Netlify                                                   |
| Dev env & CI | Nix flake (`flake.nix`)                                   |

## Getting started

The toolchain is pinned with Nix, so the only prerequisite is
[Nix](https://nixos.org/download) with flakes enabled.

```sh
nix develop        # enter a shell with node, chromium, lychee, gh, etc.
npm ci             # install JS dependencies
npm run dev        # build + serve with live reload
```

`npm run dev` serves the site via `vite preview` (default <http://localhost:8080>).

## Editing content

- **Prose and details** live in [`src/_data/content.yaml`](src/_data/content.yaml)
  (`contact`, `hero`, `how_i_work`, `fees`, `about_me`). The site owner edits
  these through the CMS at `/admin`; developers can edit the YAML directly.
- **Markup** is [`src/index.html`](src/index.html) (a Handlebars template).
- **Styles** are in [`src/`](src/) — `style.scss` plus partials under
  `abstracts/`, `base/`, `components/`, and `layout/`.
- **Images**: drop a source file in [`images/`](images/) and run
  `node process-images.js images`. It emits optimised AVIF/WebP/JPEG variants
  into `src/`. In CI this runs automatically (see below).

## Scripts

| Script                   | What it does                                 |
| ------------------------ | -------------------------------------------- |
| `npm run build`          | Production build into `dst/`                 |
| `npm run preview`        | Serve the built `dst/`                       |
| `npm test`               | Validate `content.yaml` against the template |
| `npm run test:build`     | Assert the build output is correct           |
| `npm run test:a11y`      | Accessibility checks (axe)                   |
| `npm run validate:html`  | HTML validation                              |
| `npm run validate:links` | Link checking (lychee)                       |
| `npm run lighthouse`     | Lighthouse CI (performance/a11y/SEO budgets) |
| `npm run lint`           | ESLint + Prettier + Stylelint                |
| `npm run format`         | Prettier write                               |

## CI/CD

GitHub Actions runs every step **inside the Nix devShell** (`nix develop`), so
CI uses the exact toolchain pinned in `flake.nix`:

- [`deploy.yml`](.github/workflows/deploy.yml) — on pushes and PRs to `main`:
  content validation, lint, build, HTML/a11y/link checks, and Lighthouse.
- [`process-images.yml`](.github/workflows/process-images.yml) — regenerates
  optimised image variants when files under `images/` change and commits them.

`main` is protected: changes land via pull request with the `test` check
passing. Netlify builds and deploys `main` (and publishes deploy previews for
PRs). Dependabot PRs auto-merge once CI passes.

## Project layout

```
images/                 Source images (pre-optimisation)
src/
  index.html            Handlebars template
  _data/content.yaml    Site content
  style.scss + partials Styles
  main.js               Client-side JS (nav)
  public/               Copied as-is (favicon, fonts, robots, admin/)
    admin/              Decap CMS (config.yml + index.html)
dst/                    Build output (gitignored)
process-images.js       Image optimisation script
flake.nix               Nix dev/CI environment
netlify.toml            Build + security headers (CSP)
```
