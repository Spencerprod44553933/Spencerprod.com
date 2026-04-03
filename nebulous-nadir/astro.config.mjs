// @ts-check
import { defineConfig } from 'astro/config';

// Production site (custom domain). CI can override with SITE_URL for github.io previews.
const site = (process.env.SITE_URL || 'https://spencerprod.com').replace(/\/+$/, '');

// GitHub Pages: use "/" at custom domain root. CI sets BASE_PATH from configure-pages for project URLs.
let base = process.env.BASE_PATH;
if (base === undefined || base === '') base = '/';
if (base !== '/' && !base.endsWith('/')) base += '/';

// https://astro.build/config
export default defineConfig({
	site,
	base,
	outDir: 'dist',
	trailingSlash: 'always',
});
