import { describe, it, expect } from 'vitest';
import { binarySearch } from '../../core/algorithms/searching/binarySearch';

describe('Binary Search Core Algorithm Unit Tests', () => {
  const sortedArray = [10, 20, 30, 40, 50, 60, 70, 80, 90];

  it('1. Target dizinin ortasındaysa (mid) 1 adımda bulunmalı', () => {
    // Array: [10, 20, 30, 40, 50, 60, 70, 80, 90], mid = index 4 (50)
    const events = binarySearch.generateSteps(sortedArray, 50);
    const compareStep = events[0];

    expect(compareStep.type).toBe('COMPARE');
    expect(compareStep.indices).toEqual([4]);
    expect(compareStep.values).toEqual([50, 50]);
    expect(compareStep.sortedIndices).toEqual([4]);
    expect(compareStep.meta?.kind).toBe('binary-search');
    if (compareStep.meta?.kind === 'binary-search') {
      expect(compareStep.meta.low).toBe(0);
      expect(compareStep.meta.mid).toBe(4);
      expect(compareStep.meta.high).toBe(8);
    }

    const completeStep = events[events.length - 1];
    expect(completeStep.type).toBe('COMPLETE');
    expect(completeStep.sortedIndices).toEqual([4]);
    expect(completeStep.stats.comparisons).toBe(1);
  });

  it('2. Target sol taraftaysa low/high aralığı doğru daralarak bulunmalı', () => {
    // Target 20 (index 1)
    const events = binarySearch.generateSteps(sortedArray, 20);

    // 1. Adım: mid = 4 (50). 50 > 20 -> high = 3
    expect(events[0].indices).toEqual([4]);
    if (events[0].meta?.kind === 'binary-search') {
      expect(events[0].meta.low).toBe(0);
      expect(events[0].meta.high).toBe(8);
    }

    // 2. Adım: low = 0, high = 3 -> mid = 1 (20). 20 === 20 -> MATCH!
    expect(events[1].indices).toEqual([1]);
    if (events[1].meta?.kind === 'binary-search') {
      expect(events[1].meta.low).toBe(0);
      expect(events[1].meta.high).toBe(3);
    }
    expect(events[1].sortedIndices).toEqual([1]);

    const completeStep = events[events.length - 1];
    expect(completeStep.sortedIndices).toEqual([1]);
  });

  it('3. Target sağ taraftaysa low/high aralığı doğru daralarak bulunmalı', () => {
    // Target 80 (index 7)
    const events = binarySearch.generateSteps(sortedArray, 80);

    // 1. Adım: mid = 4 (50). 50 < 80 -> low = 5
    expect(events[0].indices).toEqual([4]);

    // 2. Adım: low = 5, high = 8 -> mid = 6 (70). 70 < 80 -> low = 7
    expect(events[1].indices).toEqual([6]);
    if (events[1].meta?.kind === 'binary-search') {
      expect(events[1].meta.low).toBe(5);
      expect(events[1].meta.high).toBe(8);
    }

    // 3. Adım: low = 7, high = 8 -> mid = 7 (80). 80 === 80 -> MATCH!
    expect(events[2].indices).toEqual([7]);
    if (events[2].meta?.kind === 'binary-search') {
      expect(events[2].meta.low).toBe(7);
      expect(events[2].meta.high).toBe(8);
    }
    expect(events[2].sortedIndices).toEqual([7]);

    const completeStep = events[events.length - 1];
    expect(completeStep.sortedIndices).toEqual([7]);
  });

  it('4. Target dizide yoksa NOT FOUND durumu dönmeli', () => {
    const events = binarySearch.generateSteps(sortedArray, 999);
    const completeStep = events[events.length - 1];

    expect(completeStep.type).toBe('COMPLETE');
    expect(completeStep.sortedIndices).toEqual([]);
    expect(events.length).toBeGreaterThan(1);
  });

  it('5. Tek elemanlı dizide arama doğru yapılmalı', () => {
    const singleArr = [42];

    const foundEvents = binarySearch.generateSteps(singleArr, 42);
    expect(foundEvents[0].sortedIndices).toEqual([0]);
    expect(foundEvents[foundEvents.length - 1].sortedIndices).toEqual([0]);

    const notFoundEvents = binarySearch.generateSteps(singleArr, 99);
    expect(notFoundEvents[notFoundEvents.length - 1].sortedIndices).toEqual([]);
  });

  it('6. İki elemanlı dizide arama doğru yapılmalı', () => {
    const twoArr = [10, 20];

    const events1 = binarySearch.generateSteps(twoArr, 10);
    expect(events1[events1.length - 1].sortedIndices).toEqual([0]);

    const events2 = binarySearch.generateSteps(twoArr, 20);
    expect(events2[events2.length - 1].sortedIndices).toEqual([1]);
  });

  it('7. Tekrarlayan elemanlar içeren dizide arama çökmeden yapılmalı', () => {
    const dupArr = [5, 5, 5, 5, 5];
    const events = binarySearch.generateSteps(dupArr, 5);

    expect(events[0].sortedIndices).toEqual([2]); // mid = 2
    expect(events[events.length - 1].sortedIndices).toEqual([2]);
  });

  it('8. Low / mid / high değerlerinin event metasına doğru yazıldığı doğrulanmalı', () => {
    const events = binarySearch.generateSteps([10, 20, 30, 40, 50], 40);

    // 1. Adım: low 0, mid 2, high 4
    expect(events[0].meta?.kind).toBe('binary-search');
    if (events[0].meta?.kind === 'binary-search') {
      expect(events[0].meta.low).toBe(0);
      expect(events[0].meta.mid).toBe(2);
      expect(events[0].meta.high).toBe(4);
    }

    // 2. Adım: 30 < 40 -> low = 3. low 3, mid 3, high 4
    expect(events[1].meta?.kind).toBe('binary-search');
    if (events[1].meta?.kind === 'binary-search') {
      expect(events[1].meta.low).toBe(3);
      expect(events[1].meta.mid).toBe(3);
      expect(events[1].meta.high).toBe(4);
    }
  });

  it('9. Comparison sayısı doğru artmalı', () => {
    const events = binarySearch.generateSteps(sortedArray, 80);
    const compareSteps = events.filter((e) => e.type === 'COMPARE');

    compareSteps.forEach((step, idx) => {
      expect(step.stats.comparisons).toBe(idx + 1);
    });
  });

  it('10. Event trace bütünlüğü korunmalı (stepIndex ve totalSteps)', () => {
    const events = binarySearch.generateSteps(sortedArray, 30);
    const total = events.length;

    events.forEach((e, idx) => {
      expect(e.stepIndex).toBe(idx + 1);
      expect(e.totalSteps).toBe(total);
      expect(e.meta?.kind).toBe('binary-search');
    });
  });

  it('11. Target dışarıdan parametre olarak geçildiğinde kullanılmalı', () => {
    const events = binarySearch.generateSteps(sortedArray, 70);
    expect(events[0].values[1]).toBe(70);
  });

  it('12. Algoritma deterministic/pure olmalı', () => {
    const run1 = binarySearch.generateSteps(sortedArray, 30);
    const run2 = binarySearch.generateSteps(sortedArray, 30);

    expect(run1).toEqual(run2);
  });
});
