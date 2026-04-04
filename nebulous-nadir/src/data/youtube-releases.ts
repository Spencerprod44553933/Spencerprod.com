/**
 * Spencer Prod — https://www.youtube.com/@spencerprod4939
 * Order: oldest → newest (upload date). Sourced from YouTube’s public channel RSS;
 * the feed only includes the 15 latest videos—re-run a fetch when you need to refresh.
 */
export const YOUTUBE_CHANNEL_URL = 'https://www.youtube.com/@spencerprod4939';

export type YoutubeRelease = {
	videoId: string;
	title: string;
	published: string;
};

export const YOUTUBE_RELEASES: YoutubeRelease[] = [
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
