/**
 * Base-aware URLs for top-level sections.
 * With `trailingSlash: 'always'`, every section path ends in `/` (better on GitHub Pages).
 */
export function sectionUrl(baseUrl: string, segment: string): string {
	const root = baseUrl.endsWith('/') ? baseUrl : `${baseUrl}/`;
	const s = segment.replace(/^\/+|\/+$/g, '');
	if (!s) return root;
	return `${root}${s}/`;
}
