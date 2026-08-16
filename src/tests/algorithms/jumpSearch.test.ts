import { describe, it, expect } from 'vitest';
import { jumpSearch } from '../../core/algorithms/searching/jumpSearch';

describe('Jump Search Core Algorithm Unit Tests', () => {
  const sortedArray = [10, 18, 24, 31, 42, 54, 67, 73, 81, 95];

  it('1. Target dizide bulunduğunda doğru indekste bulunmalı', () => {
    // Target = 67 (index 6)
    const events = jumpSearch.generateSteps(sortedArray, 67);
    const completeStep = events[events.length - 1];

    expect(completeStep.type).toBe('COMPLETE');
    expect(completeStep.sortedIndices).toEqual([6]);
    expect(completeStep.stats.comparisons).toBeGreaterThan(0);
  });

  it('2. Target dizide bulunamadığında NOT FOUND (boş sortedIndices) üretilmeli', () => {
    const events = jumpSearch.generateSteps(sortedArray, 999);
    const completeStep = events[events.length - 1];

    expect(completeStep.type).toBe('COMPLETE');
    expect(completeStep.sortedIndices).toEqual([]);
  });

  it('3. Target dizinin ilk elemanında (indeks 0) olduğunda bulunabilmeli', () => {
    const events = jumpSearch.generateSteps(sortedArray, 10);
    const completeStep = events[events.length - 1];

    expect(completeStep.sortedIndices).toEqual([0]);
  });

  it('4. Target dizinin son elemanında (indeks n-1) olduğunda bulunabilmeli', () => {
    const events = jumpSearch.generateSteps(sortedArray, 95);
    const completeStep = events[events.length - 1];

    expect(completeStep.sortedIndices).toEqual([9]);
  });

  it('5. Target dizinin ortasında olduğunda bulunabilmeli', () => {
    const events = jumpSearch.generateSteps(sortedArray, 42);
    const completeStep = events[events.length - 1];

    expect(completeStep.sortedIndices).toEqual([4]);
  });

  it('6. Target tam bir blok sınırında olduğunda bulunabilmeli', () => {
    // Array len 10 -> blockSize = 3. Jump indices: 2, 5, 8. Target = 31 (index 3)
    const events = jumpSearch.generateSteps(sortedArray, 31);
    const completeStep = events[events.length - 1];

    expect(completeStep.sortedIndices).toEqual([3]);
  });

  it('7. Tekrarlayan elemanlar (duplicates) içeren dizide sorunsuz çalışmalı', () => {
    const dupArr = [5, 5, 5, 5, 5, 5];
    const events = jumpSearch.generateSteps(dupArr, 5);

    const completeStep = events[events.length - 1];
    expect(completeStep.sortedIndices.length).toBe(1);
    expect(completeStep.sortedIndices[0]).toBeGreaterThanOrEqual(0);
  });

  it('8. Tek elemanlı dizide (length = 1) arama yapılabilmeli', () => {
    const singleArr = [42];

    const foundEvents = jumpSearch.generateSteps(singleArr, 42);
    expect(foundEvents[foundEvents.length - 1].sortedIndices).toEqual([0]);

    const notFoundEvents = jumpSearch.generateSteps(singleArr, 99);
    expect(notFoundEvents[notFoundEvents.length - 1].sortedIndices).toEqual([]);
  });

  it('9. İki elemanlı dizide (length = 2) arama yapılabilmeli', () => {
    const twoArr = [10, 20];

    const events1 = jumpSearch.generateSteps(twoArr, 10);
    expect(events1[events1.length - 1].sortedIndices).toEqual([0]);

    const events2 = jumpSearch.generateSteps(twoArr, 20);
    expect(events2[events2.length - 1].sortedIndices).toEqual([1]);
  });

  it('10. Üç elemanlı dizide (length = 3) arama yapılabilmeli', () => {
    const threeArr = [10, 20, 30];
    const events = jumpSearch.generateSteps(threeArr, 20);
    expect(events[events.length - 1].sortedIndices).toEqual([1]);
  });

  it('11. 50 elemanlı büyük dizide arama doğru çalışmalı', () => {
    const bigArr = Array.from({ length: 50 }, (_, i) => (i + 1) * 2); // 2, 4, 6, ..., 100
    const target = 74; // index 36

    const events = jumpSearch.generateSteps(bigArr, target);
    const completeStep = events[events.length - 1];

    expect(completeStep.sortedIndices).toEqual([36]);
    expect(events.length).toBeGreaterThan(0);
  });

  it('12. Sıçrama (jump) ve doğrusal (linear) aşama olay dizisi sırası doğru olmalı', () => {
    const events = jumpSearch.generateSteps(sortedArray, 67);

    const jumpEvents = events.filter((e) => e.meta?.kind === 'jump-search' && e.meta.phase === 'jump');
    const linearEvents = events.filter((e) => e.meta?.kind === 'jump-search' && e.meta.phase === 'linear');

    expect(jumpEvents.length).toBeGreaterThan(0);
    expect(linearEvents.length).toBeGreaterThan(0);
    // Sıra: önce jump eventleri, ardından linear eventler gelmeli
    const firstLinearIdx = events.findIndex((e) => e.meta?.kind === 'jump-search' && e.meta.phase === 'linear');
    const lastJumpIdx = events.map((e) => e.meta?.kind === 'jump-search' ? e.meta.phase : undefined).lastIndexOf('jump');

    if (firstLinearIdx !== -1 && lastJumpIdx !== -1) {
      expect(firstLinearIdx).toBeGreaterThan(lastJumpIdx);
    }
  });

  it('13. Blok sınırları (blockStart, blockEnd, blockSize) metada doğru hesaplanmalı', () => {
    const events = jumpSearch.generateSteps(sortedArray, 73);
    const jumpStep = events.find((e) => e.meta?.kind === 'jump-search' && e.meta.phase === 'jump');

    if (jumpStep?.meta?.kind === 'jump-search') {
      expect(jumpStep.meta.blockSize).toBe(3); // sqrt(10) = 3
      expect(jumpStep.meta.blockStart).toBeDefined();
      expect(jumpStep.meta.blockEnd).toBeDefined();
    }
  });

  it('14. Karşılaştırma sayısı (comparisons) monotonik artmalı', () => {
    const events = jumpSearch.generateSteps(sortedArray, 81);

    for (let i = 0; i < events.length - 1; i++) {
      expect(events[i + 1].stats.comparisons).toBeGreaterThanOrEqual(events[i].stats.comparisons);
    }
  });

  it('15. Algoritma tam olarak pure ve deterministic olmalı', () => {
    const run1 = jumpSearch.generateSteps(sortedArray, 54);
    const run2 = jumpSearch.generateSteps(sortedArray, 54);

    expect(run1).toEqual(run2);
  });
});
