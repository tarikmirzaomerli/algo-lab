import { describe, it, expect } from 'vitest';
import { exponentialSearch } from '../../core/algorithms/searching/exponentialSearch';

describe('Exponential Search Core Algorithm Unit Tests', () => {
  const sortedArray = [3, 8, 12, 17, 25, 31, 42, 56, 71, 89];

  it('1. Hedef ilk elemandaysa (indeks 0) doğrudan bulunmalı', () => {
    const events = exponentialSearch.generateSteps(sortedArray, 3);
    const lastEvent = events[events.length - 1];

    expect(lastEvent.type).toBe('COMPLETE');
    expect(lastEvent.sortedIndices).toEqual([0]);
    // 0. eleman dogrudan eslestigi icin BOUND fazinda 0. indekste tamamlanmali
    expect(events[0].indices).toEqual([0]);
    expect(events[0].sortedIndices).toEqual([0]);
  });

  it('2. Hedef son elemandaysa (indeks 9) doğru şekilde bulunmalı', () => {
    const events = exponentialSearch.generateSteps(sortedArray, 89);
    const lastEvent = events[events.length - 1];

    expect(lastEvent.type).toBe('COMPLETE');
    expect(lastEvent.sortedIndices).toEqual([9]);
  });

  it('3. Hedef ortadaysa (ör. 56, indeks 7) doğru bulunmalı', () => {
    const events = exponentialSearch.generateSteps(sortedArray, 56);
    const lastEvent = events[events.length - 1];

    expect(lastEvent.type).toBe('COMPLETE');
    expect(lastEvent.sortedIndices).toEqual([7]);
  });

  it('4. Hedef dizide bulunamadığında sortedIndices boş dönmeli', () => {
    const events = exponentialSearch.generateSteps(sortedArray, 100);
    const lastEvent = events[events.length - 1];

    expect(lastEvent.type).toBe('COMPLETE');
    expect(lastEvent.sortedIndices).toEqual([]);
  });

  it('5. Tek elemanlı array edge case', () => {
    const singleArr = [42];

    const foundEvents = exponentialSearch.generateSteps(singleArr, 42);
    expect(foundEvents[foundEvents.length - 1].sortedIndices).toEqual([0]);

    const notFoundEvents = exponentialSearch.generateSteps(singleArr, 99);
    expect(notFoundEvents[notFoundEvents.length - 1].sortedIndices).toEqual([]);
  });

  it('6. İki elemanlı array edge case', () => {
    const twoArr = [10, 20];

    const events1 = exponentialSearch.generateSteps(twoArr, 10);
    expect(events1[events1.length - 1].sortedIndices).toEqual([0]);

    const events2 = exponentialSearch.generateSteps(twoArr, 20);
    expect(events2[events2.length - 1].sortedIndices).toEqual([1]);

    const events3 = exponentialSearch.generateSteps(twoArr, 15);
    expect(events3[events3.length - 1].sortedIndices).toEqual([]);
  });

  it('7. Negatif değerler içeren sıralı dizi', () => {
    const negArr = [-50, -30, -10, 0, 15, 45];
    const events = exponentialSearch.generateSteps(negArr, -10);

    expect(events[events.length - 1].sortedIndices).toEqual([2]);
  });

  it('8. Tekrarlanan (duplicate) değerler içeren sıralı dizi', () => {
    const dupArr = [10, 20, 20, 20, 30, 40];
    const events = exponentialSearch.generateSteps(dupArr, 20);
    const lastEvent = events[events.length - 1];

    expect(lastEvent.type).toBe('COMPLETE');
    expect(dupArr[lastEvent.sortedIndices[0]]).toBe(20);
  });

  it('9. BOUND fazında indeksler 1 -> 2 -> 4 -> 8 olarak iki katına çıkmalı', () => {
    const events = exponentialSearch.generateSteps(sortedArray, 56);
    const boundEvents = events.filter(e => e.meta?.kind === 'exponential-search' && e.meta.phase === 'BOUND');

    const boundIndices = boundEvents.map(e => e.meta?.kind === 'exponential-search' ? e.meta.boundIndex : undefined);
    // 0 (ilk eleman kontrolü), 1, 2, 4, 8 (veya son bound)
    expect(boundIndices).toContain(0);
    expect(boundIndices).toContain(1);
    expect(boundIndices).toContain(2);
    expect(boundIndices).toContain(4);
    expect(boundIndices).toContain(8);
  });

  it('10. BOUND fazından BINARY fazına geçiş yapılmalı ve event metaları doğru olmalı', () => {
    const events = exponentialSearch.generateSteps(sortedArray, 56);

    const phases = events.map(e => e.meta?.kind === 'exponential-search' ? e.meta.phase : undefined);
    expect(phases).toContain('BOUND');
    expect(phases).toContain('BINARY');

    const binaryEvents = events.filter(e => e.meta?.kind === 'exponential-search' && e.meta.phase === 'BINARY');
    expect(binaryEvents.length).toBeGreaterThan(0);
  });

  it('11. BINARY fazında low, mid ve high değerleri geçerli olmalı', () => {
    const events = exponentialSearch.generateSteps(sortedArray, 56);
    const binaryEvents = events.filter(e => e.meta?.kind === 'exponential-search' && e.meta.phase === 'BINARY');

    binaryEvents.forEach(e => {
      if (e.meta?.kind === 'exponential-search') {
        expect(e.meta.low).toBeDefined();
        expect(e.meta.mid).toBeDefined();
        expect(e.meta.high).toBeDefined();
        expect(e.meta.low!).toBeLessThanOrEqual(e.meta.mid!);
        expect(e.meta.mid!).toBeLessThanOrEqual(e.meta.high!);
      }
    });
  });

  it('12. Algoritma deterministic/pure çalışmalı ve initialArray asla mutate edilmemeli', () => {
    const original = [3, 8, 12, 17, 25, 31, 42, 56, 71, 89];
    const copy = [...original];

    exponentialSearch.generateSteps(original, 42);
    expect(original).toEqual(copy);
  });
});
