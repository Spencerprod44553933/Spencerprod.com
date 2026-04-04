/**
 * Bilingual copy for the Dinastía album review (music blog).
 * Track titles are proper nouns; body + UI strings are translated.
 */
export type TrackTier = 'standout' | 'deep' | 'favorite' | 'muted' | 'deluxe';
export type PillKey = 'standout' | 'deep' | 'favorite' | 'deluxe' | 'deluxeBonus';

export interface ReviewTrack {
	name: string;
	tier: TrackTier;
	pill?: PillKey;
	/** When true, `en` / `es` may contain inline HTML (e.g. <em> for album titles). */
	richText?: boolean;
	en: string;
	es: string;
}

export const pillLabels = {
	en: {
		standout: 'Standout',
		deep: 'Deep cut',
		favorite: 'Personal favorite',
		deluxe: 'Deluxe',
		deluxeBonus: 'Deluxe · Best of the bonus',
	},
	es: {
		standout: 'Destacado',
		deep: 'Corte profundo',
		favorite: 'Favorita personal',
		deluxe: 'Deluxe',
		deluxeBonus: 'Deluxe · Lo mejor del extra',
	},
} as const;

export const reviewUi = {
	en: {
		pageTitle: 'Dinastía — album review · Music blog',
		description: 'Album review: Dinastía by Peso Pluma and Tito Doble P. — Spencerprod.',
		eyebrow: 'Music blog',
		h1: 'Music blog',
		lede: 'Hot takes. Correct takes. Mine.',
		meta: 'April 1, 2026 · Album review',
		kicker: 'Album review',
		essential: 'Essential listening',
		starsAria: '5 out of 5 stars',
		sectionStandard: 'The standard cuts',
		ruleDeluxe: 'Deluxe edition',
		verdictLabel: 'Final verdict',
		backLink: '← My Music (releases)',
		langToggle: 'Language',
		langEn: 'English',
		langEs: 'Español',
	},
	es: {
		pageTitle: 'Dinastía — reseña de álbum · Blog de música',
		description: 'Reseña del álbum Dinastía de Peso Pluma y Tito Doble P. — Spencerprod.',
		eyebrow: 'Blog de música',
		h1: 'Blog de música',
		lede: 'Opiniones fuertes. Correctas. Mías.',
		meta: '1 de abril de 2026 · Reseña de álbum',
		kicker: 'Reseña de álbum',
		essential: 'Escucha esencial',
		starsAria: '5 de 5 estrellas',
		sectionStandard: 'Los temas del álbum',
		ruleDeluxe: 'Edición deluxe',
		verdictLabel: 'Veredicto final',
		backLink: '← Mi música (lanzamientos)',
		langToggle: 'Idioma',
		langEn: 'English',
		langEs: 'Español',
	},
} as const;

export const reviewIntro: { en: [string, string]; es: [string, string] } = {
	en: [
		'There are albums that entertain, and then there are albums that define a moment. Dinastía falls firmly into the latter category. From the very first notes, Peso Pluma makes his intentions clear: this is a statement record, one that sets a tone and refuses to let go. The intro does exactly what a great opener should — it signals that something special is about to unfold.',
		'Spanning a rich standard tracklist and a generous deluxe edition, Dinastía is a showcase of the range and confidence that has made Peso Pluma one of the most compelling voices in regional Mexican music. Not every track reaches the same heights, but the peaks are extraordinary.',
	],
	es: [
		'Hay discos que entretienen, y luego hay discos que definen un momento. Dinastía cae con claridad en la segunda categoría. Desde las primeras notas, Peso Pluma deja en claro su intención: es un disco declaración, que marca un tono y no suelta. La introducción hace justo lo que debe hacer un gran arranque: avisa que algo especial está por desplegarse.',
		'Con una lista base sólida y una edición deluxe generosa, Dinastía exhibe el alcance y la seguridad que han convertido a Peso Pluma en una de las voces más convincentes de la música regional mexicana. No todos los temas llegan a la misma altura, pero los picos son extraordinarios.',
	],
};

export const reviewPullquote = {
	en: 'When Malibu ended, there was only one instinct: play it again.',
	es: 'Cuando terminó Malibu, solo hubo un instinto: volver a ponerla.',
};

export const reviewVerdict = {
	en: 'Dinastía is the work of an artist firing on all cylinders. Tracks like “Malibu,” “Viejo Lobo,” “7-3,” “Billete,” and “Daño” are the kinds of songs that remind you what great music feels like — immediate, visceral, and emotionally true. Not every moment lands at the same altitude, but that is the nature of an ambitious full-length record. What Peso Pluma delivers here is something that cements his place at the top of the conversation. Essential listening.',
	es: 'Dinastía es el trabajo de un artista en plena racha. Temas como “Malibu”, “Viejo Lobo”, “7-3”, “Billete” y “Daño” son de esos que te recuerdan qué se siente una gran canción: inmediata, visceral y emocionalmente honesta. No todos los momentos vuelan a la misma altura, pero eso es la naturaleza de un larga duración ambicioso. Lo que Peso Pluma entrega aquí consolida su lugar en la cima de la conversación. Escucha esencial.',
};

export const reviewTracks: ReviewTrack[] = [
	{
		name: 'Dopamina',
		tier: 'standout',
		pill: 'standout',
		en: 'A crowd favorite in every sense of the phrase, “Dopamina” is the kind of track that earns its reputation night after night on stage — and fittingly serves as the album’s concert closer. It hits with the immediacy of a song that was designed to be heard at full volume with a crowd around you.',
		es: 'Favorita del público en todo sentido, “Dopamina” es de esas piezas que se ganan la fama noche tras noche en el escenario — y encaja como cierre de concierto. Golpea con la inmediatez de un tema pensado para escucharse a todo volumen rodeado de gente.',
	},
	{
		name: 'Ni Pedo',
		tier: 'deep',
		pill: 'deep',
		en: 'A solid song in its own right, “Ni Pedo” is the type of track you return to occasionally rather than compulsively. It suffers less from any quality deficit and more from the company it keeps — surrounded by some of the strongest material on the project, it can feel underserved by the spotlight.',
		es: 'Sólida por derecho propio, “Ni Pedo” es de esas que vuelves a escuchar de vez en cuando más que por obsesión. Le pega menos un déficit de calidad y más el entorno: rodeada de lo más fuerte del proyecto, puede quedar opacada.',
	},
	{
		name: 'Putielegante',
		tier: 'deep',
		pill: 'deep',
		en: 'Much the same can be said for “Putielegante” — a track that, on a lesser album, would stand out with ease. Here it gets swallowed by the sheer ambition of what surrounds it. The record is simply too good for certain songs to breathe as freely as they might deserve.',
		es: 'Algo parecido pasa con “Putielegante”: en un disco menor destacaría sin esfuerzo. Aquí la devora la ambición de lo que la rodea. El álbum es tan bueno que algunos temas no alcanzan a respirar todo lo que merecerían.',
	},
	{
		name: '7-3',
		tier: 'standout',
		pill: 'standout',
		en: 'From the moment those opening horns arrive, “7-3” announces itself as something special. The energy built in the introduction never dissipates — it carries through the entire runtime with a momentum that feels both deliberate and effortless. One of the album’s most viscerally satisfying cuts.',
		es: 'Desde que entran los metales del inicio, “7-3” se presenta como algo especial. La energía del arranque no se diluye: atraviesa todo el tema con un empuje que se siente deliberado y natural. De los cortes más visceralmente satisfactorios del álbum.',
	},
	{
		name: 'Billete',
		tier: 'favorite',
		pill: 'favorite',
		en: 'Criminally underappreciated by the general conversation around this album, “Billete” is, in this listener’s estimation, an absolute hidden gem. It carries an unmistakable flex energy — the kind of track that sounds deceptively cool at home but transforms into something otherworldly in a live setting. The crowd energy it generates is exactly what this type of song was built for.',
		es: 'Criminalmente subvalorada en la conversación general del disco, “Billete” es, para este oído, una joya escondida. Trae un flex inconfundible: en casa suena engañosamente cool, pero en vivo se vuelve otra cosa. La energía del público es justo para lo que este tipo de tema existe.',
	},
	{
		name: 'Daño',
		tier: 'standout',
		pill: 'standout',
		en: 'A genuine emotional centerpiece. Peso’s vocal performance on “Daño” is among the most affecting on the entire record — there is a tenderness in the delivery that reaches places most tracks in this genre do not even attempt. Beautiful, unhurried, and deeply moving.',
		es: 'Un verdadero centro emocional. La voz de Peso en “Daño” está entre lo más conmovedor del disco: hay una ternura en el fraseo que toca donde pocos temas del género siquiera intentan. Hermosa, sin prisa y profundamente emotiva.',
	},
	{
		name: 'Trucha',
		tier: 'muted',
		en: 'Fast, aggressive, and relentless — “Trucha” pulls no punches. The collaboration between Tito Doble P and Peso is immediate and hooky; you are locked in from the first bar. It’s the kind of track that demands your full attention and rewards it.',
		es: 'Rápida, agresiva y sin tregua — “Trucha” no se anda con medias tintas. La colaboración entre Tito Doble P y Peso es inmediata y pegadiza; engancha desde el primer compás. Exige atención y la paga.',
	},
	{
		name: 'Morras II',
		tier: 'muted',
		richText: true,
		en: 'As a sequel to &ldquo;Las Morras&rdquo; from <em class="mb-em">Genesis</em> &mdash; an album that deserves its own conversation as perhaps the definitive record of its genre &mdash; this track carries significant expectations. On first listen it reads as understated, and repeated plays soften but do not entirely dispel that impression. It is far from bad, but it is not the kind of song you reach for instinctively.',
		es: 'Como secuela de &ldquo;Las Morras&rdquo; en <em class="mb-em">Genesis</em> &mdash; un &aacute;lbum que merece su propia charla como quiz&aacute; el definitivo del g&eacute;nero &mdash; este tema llega con expectativas altas. A la primera pasada se siente contenido, y las repeticiones suavizan pero no borran del todo esa sensaci&oacute;n. Lejos de malo, pero no es de los que buscas por instinto.',
	},
	{
		name: 'Mezcal',
		tier: 'standout',
		pill: 'standout',
		en: 'The opening vocals on “Mezcal” are an immediate signal that something different is at work here. It offers a genuine breath of fresh air — distinct enough to feel like a detour, cohesive enough to feel essential. The thematic continuity with the rest of the album is never broken; it simply offers a new angle on familiar territory.',
		es: 'La voz del arranque en “Mezcal” avisa al instante que aquí pasa algo distinto. Aire fresco de verdad: lo bastante aparte para sentirse desvío, lo bastante coherente para sentirse necesario. La continuidad temática con el resto del álbum no se rompe; solo abre otro ángulo sobre un terreno conocido.',
	},
	{
		name: 'Malibu',
		tier: 'favorite',
		pill: 'favorite',
		en: 'Perhaps the single greatest surprise on the album. “Malibu” catches you from the very first moment and refuses to release its grip. It holds a rare quality — the ability to feel both complete and insufficient at the same time, leaving you wanting to start it again the second it ends. A legitimate top-tier moment on an album full of them.',
		es: 'Quizá la sorpresa más grande del disco. “Malibu” agarra desde el primer segundo y no suelta. Tiene algo raro: se siente completa e insuficiente a la vez, y cuando termina ya quieres reiniciarla. Un momento de primer nivel en un álbum lleno de ellos.',
	},
	{
		name: '20\'s',
		tier: 'muted',
		en: 'Smooth, groovy, and entirely in its lane. “20’s” is the kind of track that settles into your body before your brain has a chance to process it — head-nodding, unhurried energy that rewards an attentive listen in a quiet room as much as it does anything else.',
		es: 'Suave, groovy y en su carril. “20’s” es de esas que se te meten en el cuerpo antes de que el cerebro reaccione: energía de cabeceo sin prisa, que premia una escucha atenta en silencio como cualquier otra cosa.',
	},
	{
		name: 'Viejo Lobo',
		tier: 'favorite',
		pill: 'favorite',
		en: 'Like “Malibu” before it, “Viejo Lobo” announces its distinctiveness immediately — there is something in its texture that sounds unlike anything else on the record. The collaboration between Peso and Tito here reaches a genuine artistic peak. This is the definition of a masterpiece cut: the kind of song that reminds you why you listen to music in the first place.',
		es: 'Como “Malibu” antes, “Viejo Lobo” marca diferencia al instante: hay algo en la textura que no suena a nada más del disco. La colaboración entre Peso y Tito aquí toca un pico artístico real. Definición de corte maestro: de esos que te recuerdan por qué escuchas música.',
	},
	{
		name: 'Tú Con Él',
		tier: 'muted',
		en: 'One of the album’s most emotionally resonant moments, “Tú Con Él” is the track that tends to find its audience among those who feel things deeply. On the initial pass through the album it stood as an immediate favorite — and while repeated listens have reshuffled the rankings, placing it just behind “Billete,” “Malibu,” “7-3,” “Dopamina,” “Daño,” and “Viejo Lobo,” it remains a beautifully crafted piece of music that earns its place.',
		es: 'De los momentos más emotivos del álbum, “Tú Con Él” suele encontrar a quienes sienten fuerte. En la primera vuelta fue favorita inmediata; con las repeticiones el ranking se movió y quedó justo detrás de “Billete”, “Malibu”, “7-3”, “Dopamina”, “Daño” y “Viejo Lobo”, pero sigue siendo una pieza bien armada que se gana su lugar.',
	},
	{
		name: 'Bckpckbyz',
		tier: 'muted',
		en: 'An anthem for the grind. “Bckpckbyz” speaks directly to anyone who has come up from nothing and is still in the process of building — it captures that specific feeling of shared ambition, of looking at the people beside you and understanding the road still ahead. This one belongs to those moments with your people.',
		es: 'Himno del jale. “Bckpckbyz” le habla a quien salió de abajo y sigue construyendo: esa mezcla de ambición compartida, de mirar a los tuyos y saber que aún falta camino. Es de esas para los momentos con la banda.',
	},
	{
		name: 'Chiclona',
		tier: 'deluxe',
		pill: 'deluxeBonus',
		en: 'The clear standout of the deluxe additions and, frankly, one of the best songs on the entire expanded project. “Chiclona” sits comfortably in the same conversation as “Dopamina” and “Billete” — an argument for its inclusion on the standard tracklist is not a difficult one to make.',
		es: 'Lo más claro del deluxe y, sin rodeos, de lo mejor del proyecto ampliado. “Chiclona” entra sin pena en la misma charla que “Dopamina” y “Billete”: no cuesta defender que debió estar en la lista estándar.',
	},
	{
		name: 'London',
		tier: 'deluxe',
		pill: 'deluxe',
		en: 'A strong second showing from the bonus material, “London” holds its own with confidence. It fits the album’s sensibility naturally and leaves you glad it made the cut.',
		es: 'Segundo round fuerte del material extra: “London” se sostiene con seguridad. Encaja con el tono del álbum y te alegra que entrara.',
	},
	{
		name: 'Ganga',
		tier: 'deluxe',
		pill: 'deluxe',
		en: 'Kinetic, breathless, and impossible to sit still through — “Ganga” is one of those songs that hijacks your body the moment it starts. Whether you are in a car, a room, or anywhere in between, it moves you. A worthy addition to an already loaded runtime.',
		es: 'Kinética, sin aliento e imposible de estar quieto — “Ganga” es de esas que te secuestran el cuerpo al arrancar. En el carro, en el cuarto o donde sea, te mueve. Gran suma a un tracklist ya cargado.',
	},
	{
		name: 'Marianita',
		tier: 'deluxe',
		pill: 'deluxe',
		en: 'Sharing clear DNA with “Ganga,” “Marianita” arrives as an elevated variation on a theme rather than a wholly distinct statement. It does what it sets out to do — but with “Ganga” already present on the same project, it inevitably reads as the slightly lesser iteration of the same energy. Good, but outpaced by its sibling.',
		es: 'Comparte ADN claro con “Ganga”; “Marianita” es variación elevada del tema más que declaración nueva. Cumple lo que promete — pero con “Ganga” ya en el mismo disco, termina leyéndose como la versión un poco menor de la misma energía. Buena, pero superada por la hermana.',
	},
];
