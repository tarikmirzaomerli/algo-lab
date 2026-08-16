import { describe, it, expect } from 'vitest';
import { linearSearch, linearSearchMetadata } from '../../core/algorithms/searching/linearSearch';

describe('Linear Search Algorithm Core & Event Simulation Tests', () => {
  it('Metadata yapısı geçerli ve eksiksiz olmalı', () => {
    expect(linearSearchMetadata.id).toBe('linear-search');
    expect(linearSearchMetadata.category).toBe('searching');
    expect(linearSearchMetadata.complexity.time.average).toBe('O(n)');
  });

  describe('1. Hedef Eleman Konum Senaryoları', () => {
    it('Hedef ilk elemanda olduğunda (index 0) 1 karşılaştırmada bulunmalı', () => {
      const arr = [4, 8, 2, 9];
      const events = linearSearch.generateSteps(arr, 4);

      expect(events.length).toBe(2); // COMPARE(0) + COMPLETE
      expect(events[0].type).toBe('COMPARE');
      expect(events[0].indices).toEqual([0]);
      expect(events[0].values).toEqual([4, 4]);
      expect(events[0].sortedIndices).toEqual([0]);
      expect(events[0].stats.comparisons).toBe(1);

      const lastEvent = events[events.length - 1];
      expect(lastEvent.type).toBe('COMPLETE');
      expect(lastEvent.sortedIndices).toEqual([0]);
    });

    it('Hedef ortada olduğunda (index 1) doğru adım sıralaması üretilmeli', () => {
      const arr = [4, 8, 2, 9];
      const events = linearSearch.generateSteps(arr, 8);

      expect(events.length).toBe(3); // COMPARE(0) + COMPARE(1) + COMPLETE
      expect(events[0].indices).toEqual([0]);
      expect(events[0].sortedIndices).toEqual([]);

      expect(events[1].type).toBe('COMPARE');
      expect(events[1].indices).toEqual([1]);
      expect(events[1].sortedIndices).toEqual([1]);
      expect(events[1].stats.comparisons).toBe(2);
    });

    it('Hedef son elemanda olduğunda (index 3) tüm elemanlar taranmalı', () => {
      const arr = [4, 8, 2, 9];
      const events = linearSearch.generateSteps(arr, 9);

      expect(events.length).toBe(5); // COMPARE(0,1,2,3) + COMPLETE
      expect(events[3].indices).toEqual([3]);
      expect(events[3].sortedIndices).toEqual([3]);
      expect(events[3].stats.comparisons).toBe(4);
    });

    it('Hedef dizide olmadığında tüm dizi taranmalı ve sortedIndices boş kalmalı', () => {
      const arr = [4, 8, 2, 9];
      const events = linearSearch.generateSteps(arr, 100);

      expect(events.length).toBe(5); // COMPARE(0,1,2,3) + COMPLETE
      const compareSteps = events.filter((e) => e.type === 'COMPARE');
      expect(compareSteps).toHaveLength(4);
      compareSteps.forEach((step) => {
        expect(step.sortedIndices).toEqual([]);
      });

      const completeStep = events[events.length - 1];
      expect(completeStep.type).toBe('COMPLETE');
      expect(completeStep.sortedIndices).toEqual([]);
      expect(completeStep.stats.comparisons).toBe(4);
    });
  });

  describe('2. Uç Durumlar ve Tekrarlayan Değerler', () => {
    it('Tek elemanlı dizide hedef varsa tek adımda bulunmalı', () => {
      const events = linearSearch.generateSteps([5], 5);
      expect(events[0].indices).toEqual([0]);
      expect(events[0].sortedIndices).toEqual([0]);
    });

    it('Tek elemanlı dizide hedef yoksa tek karşılaştırmadan sonra COMPLETE olmalı', () => {
      const events = linearSearch.generateSteps([5], 1);
      expect(events[0].indices).toEqual([0]);
      expect(events[0].sortedIndices).toEqual([]);
      expect(events[1].type).toBe('COMPLETE');
      expect(events[1].sortedIndices).toEqual([]);
    });

    it('Tekrarlayan değerler olduğunda ilk eşleşen indeks bulunmalı ve devam etmemeli', () => {
      const arr = [5, 2, 5, 1];
      const events = linearSearch.generateSteps(arr, 5);

      expect(events[0].indices).toEqual([0]);
      expect(events[0].sortedIndices).toEqual([0]);
      expect(events.length).toBe(2); // Erken bitiş: ilk index 0
    });

    it('Kullanıcı örneğindeki tekrarlayan 73 değerlerinde ilk indekste (1) durmalı ve 2. 73 indeksine (12) geçmemeli', () => {
      const dupArr = [54, 73, 18, 85, 13, 86, 92, 53, 70, 39, 80, 44, 73];
      const events = linearSearch.generateSteps(dupArr, 73);

      expect(events).toHaveLength(3); // COMPARE(0), COMPARE(1-match), COMPLETE
      expect(events[1].indices).toEqual([1]);
      expect(events[1].sortedIndices).toEqual([1]);
      expect(events[2].type).toBe('COMPLETE');
      expect(events[2].sortedIndices).toEqual([1]);
    });

    it('Boş dizi verildiğinde çökmeden boş olay listesi üretmeli', () => {
      const events = linearSearch.generateSteps([]);
      expect(events).toHaveLength(0);
    });
  });

  describe('3. Örnek Doküman Trace Doğrulaması', () => {
    it('Array [4, 8, 2, 9, 5, 1, 7] ve Target 9 için beklenen tam olay akışı üretilmeli', () => {
      const arr = [4, 8, 2, 9, 5, 1, 7];
      const events = linearSearch.generateSteps(arr, 9);

      // Adımların hepsi totalSteps = 5 almalı
      expect(events).toHaveLength(5);

      // Step 1: COMPARE(0) -> 4 vs 9
      expect(events[0]).toMatchObject({
        stepIndex: 1,
        totalSteps: 5,
        type: 'COMPARE',
        indices: [0],
        values: [4, 9],
        sortedIndices: [],
        stats: { comparisons: 1, swaps: 0 },
      });

      // Step 2: COMPARE(1) -> 8 vs 9
      expect(events[1]).toMatchObject({
        stepIndex: 2,
        totalSteps: 5,
        type: 'COMPARE',
        indices: [1],
        values: [8, 9],
        sortedIndices: [],
        stats: { comparisons: 2, swaps: 0 },
      });

      // Step 3: COMPARE(2) -> 2 vs 9
      expect(events[2]).toMatchObject({
        stepIndex: 3,
        totalSteps: 5,
        type: 'COMPARE',
        indices: [2],
        values: [2, 9],
        sortedIndices: [],
        stats: { comparisons: 3, swaps: 0 },
      });

      // Step 4: COMPARE(3) -> 9 vs 9 (MATCH!)
      expect(events[3]).toMatchObject({
        stepIndex: 4,
        totalSteps: 5,
        type: 'COMPARE',
        indices: [3],
        values: [9, 9],
        sortedIndices: [3],
        stats: { comparisons: 4, swaps: 0 },
      });

      // Step 5: COMPLETE
      expect(events[4]).toMatchObject({
        stepIndex: 5,
        totalSteps: 5,
        type: 'COMPLETE',
        indices: [3],
        sortedIndices: [3],
        stats: { comparisons: 4, swaps: 0 },
      });
    });
  });
});
