import { describe, expect, it } from 'vitest';
import { selectForcedSubtitle } from './selectForcedSubtitle';

const track = (index: number, format: string, language: string | null, isForced: boolean) => ({
  index,
  format,
  language,
  isForced,
});

describe('what to show a viewer who has asked for nothing', () => {
  it('shows nothing where no track is forced, which is the ordinary case', () => {
    const streams = [track(2, 'srt', 'eng', false), track(3, 'srt', 'fra', false)];

    expect(selectForcedSubtitle(streams, 'eng')).toBeUndefined();
  });

  it('shows nothing at all where the file carries no subtitles', () => {
    expect(selectForcedSubtitle([], 'eng')).toBeUndefined();
  });

  it('shows a forced track in the language being heard', () => {
    const streams = [track(2, 'srt', 'eng', true)];

    expect(selectForcedSubtitle(streams, 'eng')?.index).toBe(2);
  });

  it('ignores a forced track belonging to a dub nobody is listening to', () => {
    const streams = [track(2, 'srt', 'ita', true)];

    expect(selectForcedSubtitle(streams, 'eng')).toBeUndefined();
  });

  it('picks the forced track for the dub actually playing, out of several', () => {
    const streams = [
      track(2, 'srt', 'ita', true),
      track(3, 'srt', 'eng', true),
      track(4, 'srt', 'fra', true),
    ];

    expect(selectForcedSubtitle(streams, 'eng')?.index).toBe(3);
  });

  it('prefers text over pictures, since pictures cannot be turned off or restyled', () => {
    const streams = [track(2, 'pgs', 'eng', true), track(3, 'srt', 'eng', true)];

    expect(selectForcedSubtitle(streams, 'eng')?.index).toBe(3);
  });

  it('prefers text whichever order the file lists them in', () => {
    const streams = [track(2, 'srt', 'eng', true), track(3, 'pgs', 'eng', true)];

    expect(selectForcedSubtitle(streams, 'eng')?.index).toBe(2);
  });

  it('takes pictures where that is the only forced track there is', () => {
    const streams = [track(2, 'pgs', 'eng', true)];

    expect(selectForcedSubtitle(streams, 'eng')?.index).toBe(2);
  });

  it('shows nothing where nobody can say what is being heard', () => {
    const streams = [track(2, 'srt', 'eng', true)];

    expect(selectForcedSubtitle(streams, null)).toBeUndefined();
    expect(selectForcedSubtitle(streams, undefined)).toBeUndefined();
  });

  it('does not assume a track with no language belongs to this viewing', () => {
    const streams = [track(2, 'srt', null, true)];

    expect(selectForcedSubtitle(streams, 'eng')).toBeUndefined();
  });

  it('reads the language however the file spelled it', () => {
    const streams = [track(2, 'srt', 'english', true)];

    expect(selectForcedSubtitle(streams, 'eng')?.index).toBe(2);
  });
});
