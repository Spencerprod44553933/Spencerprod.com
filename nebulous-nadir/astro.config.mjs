// @ts-check
import { defineConfig } from 'astro/config';

// GitHub Pages project sites need a base path (set in CI). Local dev uses "/".
let base = process.env.BASE_PATH || '/';
if (base !== '/' && !base.endsWith('/')) base += '/';
const site = process.env.SITE_URL || undefined;

// https://astro.build/config
export default defineConfig({
	site,
	base,
	trailingSlash: 'always',
});
