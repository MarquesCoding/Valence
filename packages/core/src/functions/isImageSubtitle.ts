const IMAGE_SUBTITLE_FORMATS = ['pgs', 'vobsub', 'dvbsub'] as const;

const PICTURES: ReadonlySet<string> = new Set(IMAGE_SUBTITLE_FORMATS);

/**
 * Whether a subtitle is pictures of words rather than the words themselves.
 *
 * The distinction decides almost everything else about a subtitle. Text can be converted, restyled,
 * turned on and off while a film plays, and costs nothing to deliver. Pictures can only be drawn
 * into the frames, which forces the video to be encoded for as long as they are on, cannot be
 * turned off without restarting the stream, and leaves a viewer no say in how they look.
 *
 * So this is the question asked before a track is offered, before one is chosen on a viewer's
 * behalf, and before a session decides what it is going to cost. It was answered in four places
 * with four copies of the same list, which is three more than a fact this load-bearing should be
 * kept in.
 *
 * @param format - The subtitle format, as the scanner recorded it.
 * @returns Whether it is pictures.
 */
const isImageSubtitle = (format: string): boolean => PICTURES.has(format.toLowerCase());

export { IMAGE_SUBTITLE_FORMATS, isImageSubtitle };
