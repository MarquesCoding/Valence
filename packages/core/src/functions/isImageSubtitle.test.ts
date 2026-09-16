import { describe, expect, it } from 'vitest';
import { IMAGE_SUBTITLE_FORMATS, isImageSubtitle } from './isImageSubtitle';

describe('telling pictures of words from the words themselves', () => {
  it('knows the three formats that are pictures', () => {
    expect(IMAGE_SUBTITLE_FORMATS.every(isImageSubtitle)).toBe(true);
  });

  it('knows the text formats are not', () => {
    for (const format of ['srt', 'webvtt', 'ass', 'ssa', 'unknown']) {
      expect(isImageSubtitle(format)).toBe(false);
    }
  });

  it('reads a format however it was capitalised', () => {
    expect(isImageSubtitle('PGS')).toBe(true);
    expect(isImageSubtitle('VobSub')).toBe(true);
  });

  it('treats a format nobody recognises as text, which is the recoverable answer', () => {
    expect(isImageSubtitle('')).toBe(false);
    expect(isImageSubtitle('something-new')).toBe(false);
  });
});
