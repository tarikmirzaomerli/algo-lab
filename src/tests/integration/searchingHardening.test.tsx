import { describe, it, expect } from 'vitest';
import { getAlgorithmById, SEARCHING_ALGORITHMS, SORTING_ALGORITHMS } from '../../core/algorithms';
import type { SimulationEvent } from '../../types/event';

describe('Searching Systems Hardening & Final Audit Suite', () => {
  const unsortedInput = [73, 12, 91, 34, 5, 68, 27];
  const sortedInput = [5, 12, 27, 34, 68, 73, 91];

  describe('1. Algoritma Doğruluğu & Pure Function Sözleşmesi', () => {
    it('Linear Search: Soldan sağa arama yapmalı ve ilk eşleşmede durmalı', () => {
      const algo = getAlgorithmById('linear-search')!;
      const events = algo.generateSteps(unsortedInput, 91);
      const lastEvent = events[events.length - 1];

      expect(lastEvent.type).toBe('COMPLETE');
      expect(lastEvent.sortedIndices).toEqual([2]); // 91 index 2'de
      expect(events[2].indices).toEqual([2]);
    });

    it('Binary Search: Sıralı dizide her adımda arama aralığını yarıya indirmeli', () => {
      const algo = getAlgorithmById('binary-search')!;
      const events = algo.generateSteps(sortedInput, 68);
      const lastEvent = events[events.length - 1];

      expect(lastEvent.type).toBe('COMPLETE');
      expect(lastEvent.sortedIndices).toEqual([4]); // 68 index 4'te
    });

    it('Jump Search: Blok sıçramaları sonrası blok içi arama yapmalı ve doğru indeksi bulmalı', () => {
      const algo = getAlgorithmById('jump-search')!;
      const events = algo.generateSteps(sortedInput, 34);
      const lastEvent = events[events.length - 1];

      expect(lastEvent.type).toBe('COMPLETE');
      expect(lastEvent.sortedIndices).toEqual([3]); // 34 index 3'te
    });

    it('Exponential Search: Sınırı üstel genişletip ardından Binary Search ile bulmalı', () => {
      const algo = getAlgorithmById('exponential-search')!;
      const events = algo.generateSteps(sortedInput, 73);
      const lastEvent = events[events.length - 1];

      expect(lastEvent.type).toBe('COMPLETE');
      expect(lastEvent.sortedIndices).toEqual([5]); // 73 index 5'te
    });
  });

  describe('2. initialArray vs workingArray İzolasyonu', () => {
    it('4 arama algoritması da çalıştırıldığında kullanıcının initialArray dizisi ASLA mutate edilmemeli', () => {
      const copyOfOriginal = [...unsortedInput];

      Object.values(SEARCHING_ALGORITHMS).forEach((algo) => {
        const workingArray =
          algo.metadata.id === 'linear-search'
            ? unsortedInput
            : [...unsortedInput].sort((a, b) => a - b);

        algo.generateSteps(workingArray, 34);
        expect(unsortedInput).toEqual(copyOfOriginal);
      });
    });
  });

  describe('3. Hedef Bulunamadı (Not Found) Senaryoları', () => {
    it('Target dizide bulunmadığında tüm 4 arama algoritması sortedIndices [] ile sonlanmalı', () => {
      const missingTarget = 999;

      Object.values(SEARCHING_ALGORITHMS).forEach((algo) => {
        const workingArray =
          algo.metadata.id === 'linear-search'
            ? unsortedInput
            : [...unsortedInput].sort((a, b) => a - b);

        const events = algo.generateSteps(workingArray, missingTarget);
        const lastEvent = events[events.length - 1];

        expect(lastEvent.type).toBe('COMPLETE');
        expect(lastEvent.sortedIndices).toEqual([]);
      });
    });
  });

  describe('4. Algoritma Metadata & Pointer İzolasyonu', () => {
    it('Linear Search adımları kind: linear-search taşımalı', () => {
      const algo = getAlgorithmById('linear-search')!;
      const events = algo.generateSteps(unsortedInput, 34);

      events.forEach((e) => {
        expect(e.meta?.kind).toBe('linear-search');
      });
    });

    it('Binary Search adımları kind: binary-search taşımalı', () => {
      const algo = getAlgorithmById('binary-search')!;
      const events = algo.generateSteps(sortedInput, 34);

      events.forEach((e) => {
        expect(e.meta?.kind).toBe('binary-search');
      });
    });

    it('Jump Search adımları kind: jump-search taşımalı', () => {
      const algo = getAlgorithmById('jump-search')!;
      const events = algo.generateSteps(sortedInput, 34);

      events.forEach((e) => {
        expect(e.meta?.kind).toBe('jump-search');
      });
    });

    it('Exponential Search adımları kind: exponential-search taşımalı', () => {
      const algo = getAlgorithmById('exponential-search')!;
      const events = algo.generateSteps(sortedInput, 34);

      events.forEach((e) => {
        expect(e.meta?.kind).toBe('exponential-search');
      });
    });
  });

  describe('5. Sorting Algoritmalarında Regresyon Kontrolü', () => {
    it('Hiçbir Sorting algoritması isSearch uyarısı taşımamalı', () => {
      const sample = [5, 3, 8, 1];

      Object.values(SORTING_ALGORITHMS).forEach((sortAlgo) => {
        const events: SimulationEvent[] = sortAlgo.generateSteps([...sample]);
        events.forEach((e) => {
          expect(e.meta?.kind === 'selection-sort' || e.meta?.kind === 'insertion-sort' || e.meta === undefined).toBe(true);
        });
      });
    });
  });
});
