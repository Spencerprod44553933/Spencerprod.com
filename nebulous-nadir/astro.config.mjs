// @ts-check
import { defineConfig } from 'astro/config';

// BASE_PATH: Astro `base` for asset and nav URLs. Local dev: "/".
// CI: GitHub Actions sets BASE_PATH from actions/configure-pages `base_path` (see deploy-astro.yml).
// Override with repo variable PAGES_BASE_PATH if needed.
let base = process.env.BASE_PATH || '/';
if (base !== '/' && !base.endsWith('/')) base += '/';
const site = process.env.SITE_URL || undefined;

// https://astro.build/config
export default defineConfig({
	site,
	base,
	trailingSlash: 'always',
});
