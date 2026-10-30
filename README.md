# Git Checkout website

The site for the [Git Checkout](https://github.com/save-workspace-as/git-checkout) extension: a landing page and the docs, built with
[Astro](https://astro.build) and [Starlight](https://starlight.astro.build).

- `src/pages/index.astro` is the landing page; `src/components` and `src/styles/landing.css` style it.
- The docs, the changelog and the screenshots are **not kept here**. `npm run sync` (which `dev` and `build` run first) brings them from the extension
  repository: the README sections become the pages in `src/content/docs/docs/`, `CHANGELOG.md` becomes the changelog, and `docs/screenshots/` the
  pictures. Edit them there. The synced files are ignored by Git. Astro turns the screenshots into WebP at build time.

```sh
npm install
npm run dev      # http://localhost:4321/git-checkout.github.io/
# the extension repository is expected next to this one; EXTENSION_PATH=<folder> says otherwise
npm run build
```

The site is served from `SITE_BASE` (default `/git-checkout.github.io`, a project site). For a custom domain set the repository variables
`SITE_URL` and `SITE_BASE=/`.
