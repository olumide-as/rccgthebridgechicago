import { describe, expect, it, vi } from 'vitest';
import { flyerFilename, normaliseName, slugifyFilenamePart } from '@/lib/filename';
import { clampOffsets, coverScale } from '@/lib/image';
import { fitText } from '@/lib/canvas';

describe('filename and name utilities', () => {
  it('normalises names', () => expect(normaliseName('  Olumide   Adigun  ')).toBe('Olumide Adigun'));
  it('sanitises filenames', () => { expect(slugifyFilenamePart('Olumide A.!')).toBe('olumide-a'); expect(flyerFilename('dwell-2026','Olumide Adigun')).toBe('dwell-2026-olumide-adigun-im-attending.png'); });
});
describe('image crop utilities', () => {
  const frame = { x:0, y:0, width:430, height:528 };
  it('calculates cover scale', () => { expect(coverScale({width:1000,height:500}, frame)).toBeCloseTo(1.056); expect(coverScale({width:500,height:1000}, frame)).toBeCloseTo(0.86); });
  it('clamps offsets', () => { const s = clampOffsets({width:1000,height:500}, frame, { zoom:1.2, offsetX:999, offsetY:-999 }); expect(s.offsetX).toBeLessThanOrEqual(385); expect(s.offsetY).toBeGreaterThanOrEqual(-36); });
});
describe('text fitting', () => {
  it('shrinks long text', () => { const ctx = { font:'', measureText: vi.fn((text:string)=>({ width: text.length * Number((ctx.font.match(/(\d+)px/)||[,40])[1]) * 0.55 })) } as unknown as CanvasRenderingContext2D; const fitted = fitText(ctx, 'Christopher Alexander Johnson', {fontFamily:'Arial',fontWeight:'800',preferred:46,minimum:24,maxWidth:300}); expect(fitted.fontSize).toBeLessThan(46); expect(fitted.text.length).toBeGreaterThan(4); });
});
