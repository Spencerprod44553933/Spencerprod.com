// @ts-check
import { defineConfig } from 'astro/config';

// BASE_PATH: "/" when the site is served at a custom domain root (e.g. spencerprod.com).
// Use "/RepoName/" only for https://user.github.io/RepoName/ (set PAGES_BASE_PATH in CI).
// Local dev uses "/".
let base = process.env.BASE_PATH || '/';
if (base !== '/' && !base.endsWith('/')) base += '/';
const site = process.env.SITE_URL || undefined;

// https://astro.build/config
export default defineConfig({
	site,
	base,
	trailingSlash: 'always',
});
