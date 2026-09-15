import { describe, expect, it } from 'vitest';
import { chainRunsHere } from './chainRunsHere';
import type { VerifiedChain } from './chainRunsHere';

const chainOf = (over: Partial<VerifiedChain> = {}): VerifiedChain => ({
  accel: 'vaapi',
  shape: 'transcode',
  bitDepth: 8,
  works: true,
  ...over,
});

describe('whether a shape of chain is one this machine will run', () => {
  it('says yes where the machine proved it', () => {
    expect(chainRunsHere([chainOf()], 'vaapi', 'transcode', 8)).toBe(true);
  });

  it('says no where the machine proved it does not', () => {
    expect(chainRunsHere([chainOf({ works: false })], 'vaapi', 'transcode', 8)).toBe(false);
  });

  it('says yes where nobody measured, which is what the media service answers', () => {
    expect(chainRunsHere([], 'vaapi', 'transcode', 8)).toBe(true);
    expect(chainRunsHere([chainOf({ accel: 'qsv' })], 'vaapi', 'transcode', 8)).toBe(true);
  });

  it('keeps the depths apart, since each was measured on its own', () => {
    const chains = [chainOf({ bitDepth: 8, works: true }), chainOf({ bitDepth: 10, works: false })];

    expect(chainRunsHere(chains, 'vaapi', 'transcode', 8)).toBe(true);
    expect(chainRunsHere(chains, 'vaapi', 'transcode', 10)).toBe(false);
  });

  it('reads anything above eight bits as the ten bit chain', () => {
    const chains = [chainOf({ bitDepth: 10, works: false })];

    expect(chainRunsHere(chains, 'vaapi', 'transcode', 12)).toBe(false);
    expect(chainRunsHere(chains, 'vaapi', 'transcode', 9)).toBe(false);
  });

  it('reads an unknown depth as eight bits rather than refusing', () => {
    const chains = [chainOf({ bitDepth: 10, works: false })];

    expect(chainRunsHere(chains, 'vaapi', 'transcode', null)).toBe(true);
    expect(chainRunsHere(chains, 'vaapi', 'transcode')).toBe(true);
  });

  it('keeps the shapes apart, so a broken sheet does not refuse a transcode', () => {
    const chains = [chainOf({ shape: 'sheet', works: false })];

    expect(chainRunsHere(chains, 'vaapi', 'transcode', 8)).toBe(true);
    expect(chainRunsHere(chains, 'vaapi', 'sheet', 8)).toBe(false);
  });
});
