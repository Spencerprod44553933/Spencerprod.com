#!/usr/bin/env node
/**
 * Build-time: merge YouTube uploads + SoundCloud tracks from all profiles.
 *
 * YouTube (priority):
 *   YOUTUBE_API_KEY + YOUTUBE_CHANNEL_ID — Data API v3 (best).
 *   Otherwise — public scrape: channel /videos (ytInitialData) + innertube browse
 *   continuations + per-video watch page for exact `datePublished`.
 *
 * SoundCloud (priority):
 *   SOUNDCLOUD_CLIENT_ID — official api.soundcloud.com resolve + tracks.
 *   Otherwise — scrape `client_id` from SoundCloud’s public web bundles (same as
 *   their site) and call api-v2. Some IPs (e.g. datacenter) may get a captcha
 *   response instead of JSON; then SoundCloud is skipped with a warning.
 */
import { writeFileSync, mkdirSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const OUT = join(__dirname, '../src/data/merged-tracks.json');

const DEFAULT_CHANNEL_ID = process.env.YOUTUBE_CHANNEL_ID || 'UCTkRyAgGCPJpbfMfQL3uWUA';

const YT_UA =
	'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36';

const SOUNDCLOUD_PROFILE_URLS = [
	'https://soundcloud.com/charles-edens-327626993',
	'https://soundcloud.com/pencerprod',
	'https://soundcloud.com/user-182465487',
	'https://soundcloud.com/charles-edens-44535500',
	'https://soundcloud.com/gted-gted',
	'https://soundcloud.com/spencer-prod-627394720',
];

/** Last resort if YouTube scrape + API both fail (keeps CI/site usable). */
const FALLBACK_YOUTUBE = [
	{ videoId: 'SXKrPg-FB1w', title: '[FREE] Juice WRLD,Nick Mira,Type Beat', published: '2020-10-26T17:00:05+00:00' },
	{ videoId: '9YQNu2XZ3yA', title: '[FREE]Dababy Type Beat', published: '2020-10-27T05:00:01+00:00' },
	{ videoId: 'MzbtAdg2Whg', title: '[FREE] Singing Piano Type Beat', published: '2020-10-28T17:30:02+00:00' },
	{ videoId: 'BD9Z266Qxf8', title: '[FREE]Drake Type Beat', published: '2020-10-29T17:00:01+00:00' },
	{ videoId: '7OiUXmDNQls', title: '[FREE]Scary Strings Type Beat', published: '2020-10-30T17:00:02+00:00' },
	{ videoId: 'WbQ2tk23dPc', title: '[FREE][Hard]Juice Wrld Type Beat', published: '2020-10-31T17:00:11+00:00' },
	{ videoId: 'Mit9wKFnLOY', title: '[FREE]Lil Tecca Type Beat', published: '2020-11-01T17:00:04+00:00' },
	{ videoId: 'sPVwmClfMUk', title: '[FREE][Guitar Trap Type Beat', published: '2020-11-02T18:00:09+00:00' },
	{ videoId: 'p_WxVRKYXqA', title: '[FREE][HARD]Guitar Type Beat', published: '2020-11-03T18:00:09+00:00' },
	{ videoId: 'yxHllEo4HnE', title: '[FREE]Iann Dior Type Beat', published: '2020-11-04T18:00:09+00:00' },
	{ videoId: 'sHLgxCR7vPI', title: '[FREE]Lil Baby Type Beat', published: '2020-11-05T18:00:13+00:00' },
	{ videoId: '97RlOoNnzsY', title: '[FREE] Future Type Beat', published: '2020-11-06T18:00:01+00:00' },
	{ videoId: '7i7AqcsmgSY', title: '[FREE] Iann Dior, Juice Wrld Type BEat', published: '2020-11-07T18:00:01+00:00' },
	{ videoId: 'loEHKfRVEtE', title: '[FREE][HARD]Dababy,XXXTENTACTION Type Beat', published: '2020-11-08T18:00:13+00:00' },
	{ videoId: 'fb2NGHcWm70', title: '[FREE]Scary Bells Type Beat', published: '2020-11-09T18:00:05+00:00' },
];

function toYoutubeTrack(v) {
	const vid = v.videoId;
	const published = new Date(v.published).toISOString();
	return {
		id: `yt-${vid}`,
		platform: 'youtube',
		title: v.title,
		publishedAt: published,
		thumbnailUrl: `https://i.ytimg.com/vi/${vid}/hqdefault.jpg`,
		watchUrl: `https://www.youtube.com/watch?v=${vid}`,
		embedUrl: `https://www.youtube.com/embed/${vid}`,
	};
}

/** Parse a JSON object starting at `{` with string/escape awareness. */
function parseBalancedObject(html, startBraceIdx) {
	let depth = 0;
	let inStr = false;
	let esc = false;
	let q = '';
	const jsonStart = startBraceIdx;
	for (let j = startBraceIdx; j < html.length; j++) {
		const ch = html[j];
		if (inStr) {
			if (esc) esc = false;
			else if (ch === '\\') esc = true;
			else if (ch === q) inStr = false;
			continue;
		}
		if (ch === '"' || ch === "'") {
			inStr = true;
			q = ch;
			continue;
		}
		if (ch === '{') depth++;
		else if (ch === '}') {
			depth--;
			if (depth === 0) return JSON.parse(html.slice(jsonStart, j + 1));
		}
	}
	throw new Error('Unclosed JSON object');
}

function extractYtInitialData(html) {
	const marker = 'var ytInitialData = ';
	const i = html.indexOf(marker);
	if (i === -1) return null;
	let pos = i + marker.length;
	while (html[pos] === ' ' || html[pos] === '\n') pos++;
	if (html[pos] !== '{') return null;
	return parseBalancedObject(html, pos);
}

function extractInnertubeApiKey(html) {
	return html.match(/"INNERTUBE_API_KEY":"([^"]+)"/)?.[1] ?? null;
}

function extractYoutubeClientVersion(html) {
	return (
		html.match(/"INNERTUBE_CONTEXT"[^}]*"clientVersion":"([\d.]+)"/)?.[1] ||
		html.match(/"clientVersion":"([\d.]+)"/)?.[1] ||
		'2.0.0'
	);
}

function walkVideoRenderers(obj, out, depth) {
	if (!obj || depth > 40) return;
	if (obj.videoRenderer?.videoId) {
		const v = obj.videoRenderer;
		const thumbs = v.thumbnail?.thumbnails;
		let thumb = '';
		if (Array.isArray(thumbs) && thumbs.length) {
			thumb = thumbs[thumbs.length - 1]?.url || thumbs[0]?.url || '';
		}
		const title = v.title?.runs?.[0]?.text || v.title?.simpleText || v.videoId;
		out.push({ videoId: v.videoId, title, thumbnailUrl: thumb });
		return;
	}
	if (Array.isArray(obj)) for (const x of obj) walkVideoRenderers(x, out, depth + 1);
	else if (typeof obj === 'object')
		for (const k of Object.keys(obj)) walkVideoRenderers(obj[k], out, depth + 1);
}

function collectContinuationTokens(obj, out, depth) {
	if (!obj || depth > 45) return;
	if (obj.continuationCommand?.token) out.push(obj.continuationCommand.token);
	if (Array.isArray(obj)) for (const x of obj) collectContinuationTokens(x, out, depth + 1);
	else if (typeof obj === 'object')
		for (const k of Object.keys(obj)) collectContinuationTokens(obj[k], out, depth + 1);
}

function collectVideoIdsFromJson(obj) {
	const s = JSON.stringify(obj);
	const ids = [...s.matchAll(/"videoId":"([\w-]{11})"/g)].map((m) => m[1]);
	return [...new Set(ids)];
}

async function youtubeiBrowse(apiKey, context, continuation) {
	const ver = context?.client?.clientVersion || '2.0.0';
	const res = await fetch(`https://www.youtube.com/youtubei/v1/browse?key=${encodeURIComponent(apiKey)}`, {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json',
			'User-Agent': YT_UA,
			'X-YouTube-Client-Name': '1',
			'X-YouTube-Client-Version': ver,
		},
		body: JSON.stringify({ context, continuation }),
	});
	if (!res.ok) {
		const t = await res.text();
		throw new Error(`youtubei browse ${res.status}: ${t.slice(0, 300)}`);
	}
	return res.json();
}

async function fetchYoutubeUploads(apiKey, channelId) {
	const uploadPlaylistId = `UU${channelId.slice(2)}`;
	const tracks = [];
	let pageToken;
	do {
		const u = new URL('https://www.googleapis.com/youtube/v3/playlistItems');
		u.searchParams.set('part', 'snippet,contentDetails');
		u.searchParams.set('playlistId', uploadPlaylistId);
		u.searchParams.set('maxResults', '50');
		u.searchParams.set('key', apiKey);
		if (pageToken) u.searchParams.set('pageToken', pageToken);
		const res = await fetch(u);
		if (!res.ok) {
			const t = await res.text();
			throw new Error(`YouTube API ${res.status}: ${t.slice(0, 400)}`);
		}
		const data = await res.json();
		for (const item of data.items ?? []) {
			const vid = item.contentDetails?.videoId || item.snippet?.resourceId?.videoId;
			if (!vid) continue;
			const sn = item.snippet;
			const publishedAt =
				item.contentDetails?.videoPublishedAt || sn?.publishedAt || new Date().toISOString();
			tracks.push({
				id: `yt-${vid}`,
				platform: 'youtube',
				title: sn.title || vid,
				publishedAt: new Date(publishedAt).toISOString(),
				thumbnailUrl:
					sn.thumbnails?.high?.url || sn.thumbnails?.medium?.url || sn.thumbnails?.default?.url || '',
				watchUrl: `https://www.youtube.com/watch?v=${vid}`,
				embedUrl: `https://www.youtube.com/embed/${vid}`,
			});
		}
		pageToken = data.nextPageToken;
	} while (pageToken);
	return tracks;
}

/** Public innertube player (no watch-page HTML; avoids bot interstitials on /watch). */
async function fetchYoutubePlayerUploadDate(videoId, apiKey, context) {
	const ver = context?.client?.clientVersion || '2.0.0';
	const res = await fetch(
		`https://www.youtube.com/youtubei/v1/player?key=${encodeURIComponent(apiKey)}`,
		{
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
				'User-Agent': YT_UA,
				'X-YouTube-Client-Name': '1',
				'X-YouTube-Client-Version': ver,
			},
			body: JSON.stringify({ context, videoId }),
		},
	);
	if (!res.ok) return null;
	const j = await res.json();
	const raw =
		j?.microformat?.playerMicroformatRenderer?.uploadDate || j?.videoDetails?.uploadDate;
	if (raw) return new Date(raw).toISOString();
	return null;
}

async function mapPool(items, limit, fn) {
	const results = new Array(items.length);
	let idx = 0;
	async function worker() {
		for (;;) {
			const i = idx++;
			if (i >= items.length) break;
			results[i] = await fn(items[i], i);
		}
	}
	const n = Math.min(limit, Math.max(1, items.length));
	await Promise.all(Array.from({ length: n }, worker));
	return results;
}

async function fetchYoutubeViaPublicScrape(channelId) {
	const tabUrl = `https://www.youtube.com/channel/${encodeURIComponent(channelId)}/videos`;
	const html = await fetch(tabUrl, { headers: { 'User-Agent': YT_UA } }).then((r) => {
		if (!r.ok) throw new Error(`YouTube channel page ${r.status}`);
		return r.text();
	});

	const initial = extractYtInitialData(html);
	if (!initial) throw new Error('Could not parse ytInitialData');

	const apiKey = extractInnertubeApiKey(html);
	if (!apiKey) throw new Error('Could not find INNERTUBE_API_KEY');

	const clientVersion = extractYoutubeClientVersion(html);
	const context = {
		client: {
			clientName: 'WEB',
			clientVersion,
			hl: 'en',
			gl: 'US',
		},
	};

	const byId = new Map();
	const addFromData = (data) => {
		const list = [];
		walkVideoRenderers(data, list, 0);
		for (const v of list) {
			if (!byId.has(v.videoId)) byId.set(v.videoId, v);
		}
	};
	addFromData(initial);

	const usedTokens = new Set();
	let tokens = [];
	collectContinuationTokens(initial, tokens, 0);
	let guard = 0;
	const maxPages = 80;

	while (tokens.length && guard++ < maxPages) {
		const token = tokens.find((t) => !usedTokens.has(t));
		if (!token) break;
		usedTokens.add(token);
		const page = await youtubeiBrowse(apiKey, context, token);
		addFromData(page);
		const newToks = [];
		collectContinuationTokens(page, newToks, 0);
		const newIds = collectVideoIdsFromJson(page);
		if (newIds.length === 0 && newToks.length === 0) break;
		tokens = newToks;
	}

	const videos = [...byId.values()];
	const dates = await mapPool(
		videos,
		6,
		async (v) => fetchYoutubePlayerUploadDate(v.videoId, apiKey, context),
	);

	const tracks = videos.map((v, i) => {
		const publishedAt = dates[i] || new Date(0).toISOString();
		const thumb =
			v.thumbnailUrl || `https://i.ytimg.com/vi/${v.videoId}/hqdefault.jpg`;
		return {
			id: `yt-${v.videoId}`,
			platform: 'youtube',
			title: v.title,
			publishedAt,
			thumbnailUrl: thumb,
			watchUrl: `https://www.youtube.com/watch?v=${v.videoId}`,
			embedUrl: `https://www.youtube.com/embed/${v.videoId}`,
		};
	});

	const missingDates = dates.filter((d) => !d).length;
	if (missingDates)
		console.warn(
			`[fetch-music] YouTube scrape: ${missingDates}/${videos.length} player responses missing uploadDate (using epoch).`,
		);

	return tracks;
}

function isSoundCloudCaptchaPayload(data) {
	return (
		data &&
		typeof data === 'object' &&
		typeof data.url === 'string' &&
		data.url.includes('captcha-delivery.com')
	);
}

function soundcloudApiTrackToMerged(t) {
	if (!t?.id || !t.permalink_url) return null;
	const art = t.artwork_url || t.user?.avatar_url || '';
	const thumb = art ? art.replace('-large', '-t500x500') : '';
	const enc = encodeURIComponent(t.permalink_url);
	return {
		id: `sc-${t.id}`,
		platform: 'soundcloud',
		title: t.title || 'Untitled',
		publishedAt: new Date(
			t.display_date || t.release_date || t.created_at || Date.now(),
		).toISOString(),
		thumbnailUrl: thumb,
		watchUrl: t.permalink_url,
		embedUrl: `https://w.soundcloud.com/player/?url=${enc}&color=%23000000&auto_play=false&hide_related=true`,
		soundcloudUser: t.user?.permalink || null,
	};
}

/** api-v2 activity stream (works with web client_id where /users/…/tracks returns captcha). */
async function fetchSoundcloudStreamTracks(userId, clientId, refererProfileUrl) {
	const headers = {
		'User-Agent': YT_UA,
		Origin: 'https://soundcloud.com',
		Referer: `${refererProfileUrl.replace(/\/$/, '')}/`,
	};
	const out = [];
	let next = `https://api-v2.soundcloud.com/stream/users/${userId}?client_id=${encodeURIComponent(clientId)}&limit=50`;
	let guard = 0;

	while (next && guard++ < 200) {
		const res = await fetch(next, { headers });
		const text = await res.text();
		let data;
		try {
			data = JSON.parse(text);
		} catch {
			throw new Error(`SoundCloud stream ${userId}: ${res.status} (non-JSON)`);
		}
		if (!res.ok || isSoundCloudCaptchaPayload(data)) {
			throw new Error(
				`SoundCloud stream ${userId}: ${res.status} ${JSON.stringify(data).slice(0, 200)}`,
			);
		}
		const coll = data.collection || [];
		for (const item of coll) {
			if (item.type === 'track' && item.track) {
				const m = soundcloudApiTrackToMerged(item.track);
				if (m) out.push(m);
			} else if (item.type === 'playlist' && item.playlist?.tracks) {
				for (const t of item.playlist.tracks) {
					const m = soundcloudApiTrackToMerged(t);
					if (m) out.push(m);
				}
			}
		}
		next = data.next_href
			? data.next_href.includes('client_id=')
				? data.next_href
				: `${data.next_href}${data.next_href.includes('?') ? '&' : '?'}client_id=${encodeURIComponent(clientId)}`
			: null;
	}
	return out;
}

async function scrapeSoundcloudWebClientId() {
	const page = await fetch('https://soundcloud.com/discover', {
		headers: {
			'User-Agent': YT_UA,
			Accept: 'text/html,application/xhtml+xml',
			'Accept-Language': 'en-US,en;q=0.9',
		},
	});
	const html = await page.text();
	const scriptUrls = [...html.matchAll(/https:\/\/a-v2\.sndcdn\.com\/assets\/\d+-[a-f0-9]+\.js/g)].map(
		(m) => m[0],
	);
	const seen = new Set();
	for (const u of scriptUrls) {
		if (seen.has(u)) continue;
		seen.add(u);
		const jr = await fetch(u, { headers: { 'User-Agent': YT_UA } });
		const js = await jr.text();
		const m = js.match(/client_id:"([a-zA-Z0-9]{32})"/);
		if (m) return m[1];
	}
	throw new Error('Could not find client_id in SoundCloud web bundles');
}

async function resolveSoundcloudUser(profileUrl, clientId, apiBase) {
	const u = new URL(`${apiBase}/resolve`);
	u.searchParams.set('url', profileUrl);
	u.searchParams.set('client_id', clientId);
	const res = await fetch(u, {
		headers: {
			'User-Agent': YT_UA,
			Origin: 'https://soundcloud.com',
			Referer: 'https://soundcloud.com/',
		},
	});
	if (!res.ok) {
		const t = await res.text();
		throw new Error(`SoundCloud resolve ${profileUrl}: ${res.status} ${t.slice(0, 200)}`);
	}
	return res.json();
}

async function fetchSoundcloudTracksForUser(userId, clientId, apiBase, refererProfileUrl) {
	const tracks = [];
	let next = `${apiBase}/users/${userId}/tracks?client_id=${encodeURIComponent(clientId)}&limit=200&linked_partitioning=1`;

	while (next) {
		const res = await fetch(next, {
			headers: {
				'User-Agent': YT_UA,
				Origin: 'https://soundcloud.com',
				Referer: `${refererProfileUrl.replace(/\/$/, '')}/`,
			},
		});
		const text = await res.text();
		let data;
		try {
			data = JSON.parse(text);
		} catch {
			throw new Error(`SoundCloud tracks ${userId}: ${res.status} ${text.slice(0, 200)}`);
		}
		if (!res.ok) {
			if (isSoundCloudCaptchaPayload(data) || (data?.url && String(data.url).includes('captcha-delivery'))) {
				throw new Error('SoundCloud returned captcha on /users/…/tracks');
			}
			throw new Error(`SoundCloud tracks ${userId}: ${res.status} ${text.slice(0, 200)}`);
		}
		if (isSoundCloudCaptchaPayload(data)) {
			throw new Error('SoundCloud returned captcha challenge (try SOUNDCLOUD_CLIENT_ID or run build locally)');
		}
		const collection = Array.isArray(data) ? data : data.collection || [];
		for (const t of collection) {
			const m = soundcloudApiTrackToMerged(t);
			if (m) tracks.push(m);
		}
		next = data.next_href
			? data.next_href.includes('client_id=')
				? data.next_href
				: `${data.next_href}${data.next_href.includes('?') ? '&' : '?'}client_id=${encodeURIComponent(clientId)}`
			: null;
	}
	return tracks;
}

async function fetchAllSoundcloud(
	clientId,
	apiBase,
	{ preferStream } = { preferStream: false },
) {
	const merged = [];
	const seenIds = new Set();
	for (const profileUrl of SOUNDCLOUD_PROFILE_URLS) {
		const user = await resolveSoundcloudUser(profileUrl, clientId, apiBase);
		if (user.kind !== 'user') continue;
		const list = preferStream
			? await fetchSoundcloudStreamTracks(user.id, clientId, profileUrl)
			: await fetchSoundcloudTracksForUser(user.id, clientId, apiBase, profileUrl);
		for (const tr of list) {
			if (seenIds.has(tr.id)) continue;
			seenIds.add(tr.id);
			merged.push(tr);
		}
	}
	return merged;
}

function sortByDateAsc(tracks) {
	return [...tracks].sort((a, b) => new Date(a.publishedAt) - new Date(b.publishedAt));
}

async function main() {
	const ytKey = process.env.YOUTUBE_API_KEY;
	const scIdEnv = process.env.SOUNDCLOUD_CLIENT_ID;

	let tracks = [];
	let source = 'fallback';

	if (ytKey) {
		const yt = await fetchYoutubeUploads(ytKey, DEFAULT_CHANNEL_ID);
		tracks.push(...yt);
		source = 'youtube-api';
	} else {
		console.warn('[fetch-music] YOUTUBE_API_KEY missing — fetching YouTube via public page scrape.');
		try {
			const yt = await fetchYoutubeViaPublicScrape(DEFAULT_CHANNEL_ID);
			tracks.push(...yt);
			source = 'youtube-scrape';
		} catch (e) {
			console.warn('[fetch-music] YouTube scrape failed:', e.message);
			tracks.push(...FALLBACK_YOUTUBE.map(toYoutubeTrack));
			source = 'youtube-fallback-list';
		}
	}

	if (scIdEnv) {
		try {
			const sc = await fetchAllSoundcloud(scIdEnv, 'https://api.soundcloud.com', {
				preferStream: false,
			});
			tracks.push(...sc);
			source += '+soundcloud-api';
		} catch (e) {
			console.warn('[fetch-music] SoundCloud API fetch failed:', e.message);
			source += '+soundcloud-error';
		}
	} else {
		console.warn(
			'[fetch-music] SOUNDCLOUD_CLIENT_ID missing — scraping web client_id + api-v2 stream/users (public activity feed).',
		);
		try {
			const scrapedId = await scrapeSoundcloudWebClientId();
			const sc = await fetchAllSoundcloud(scrapedId, 'https://api-v2.soundcloud.com', {
				preferStream: true,
			});
			tracks.push(...sc);
			source += '+soundcloud-scrape';
		} catch (e) {
			console.warn('[fetch-music] SoundCloud scrape/API failed:', e.message);
			source += '+soundcloud-skipped';
		}
	}

	tracks = sortByDateAsc(tracks);

	const payload = {
		fetchedAt: new Date().toISOString(),
		source,
		channelId: DEFAULT_CHANNEL_ID,
		tracks,
	};

	mkdirSync(dirname(OUT), { recursive: true });
	writeFileSync(OUT, JSON.stringify(payload, null, '\t') + '\n', 'utf8');
	console.log(`[fetch-music] Wrote ${tracks.length} tracks → ${OUT} (${source})`);
}

main().catch((e) => {
	console.error('[fetch-music]', e);
	process.exit(1);
});
