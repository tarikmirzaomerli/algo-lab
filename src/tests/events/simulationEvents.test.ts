import { describe, it, expect } from 'vitest';
import { ALL_ARRAY_ALGORITHMS, ALL_GRAPH_ALGORITHMS, getAlgorithmById } from '../../core/algorithms';
import type { SimulationEvent } from '../../types/event';
import { DEFAULT_GRAPH_PRESET } from '../../core/constants/defaultGraph';

describe('SimulationEvent Invariant & Validation Tests', () => {
  const edgeCaseInputs = [
    { name: 'Boş dizi', input: [] },
    { name: 'Tek elemanlı dizi', input: [42] },
    { name: 'Zaten sıralı dizi', input: [1, 2, 3, 4, 5] },
    { name: 'Ters sıralı dizi', input: [5, 4, 3, 2, 1] },
    { name: 'Tekrarlı elemanlar içeren dizi', input: [5, 2, 5, 1, 2, 5] },
    { name: 'Negatif sayılar içeren dizi', input: [-5, 3, -10, 0] },
    { name: 'Tüm elemanları aynı olan dizi', input: [4, 4, 4, 4] },
    {
      name: '50 elemanlı büyük dizi',
      input: Array.from({ length: 50 }, (_, i) => (i * 17) % 50),
    },
  ];

  const validTypes = [
    'COMPARE',
    'SWAP',
    'OVERWRITE',
    'MARK_SORTED',
    'SELECT_MIN',
    'INSERT',
    'SPLIT',
    'MERGE',
    'PIVOT_SELECT',
    'PARTITION_COMPLETE',
    'PASS_COMPLETE',
    'COMPLETE',
  ];

  describe('1. Ortak SimulationEvent Invariant Kontrolleri', () => {
    ALL_ARRAY_ALGORITHMS.forEach((algorithm) => {
      describe(`Algorithm: ${algorithm.metadata.name}`, () => {
        edgeCaseInputs.forEach(({ name, input }) => {
          it(`Olay yapısı ve durum değişmezleri geçerli olmalı: ${name}`, () => {
            const events: SimulationEvent[] = algorithm.generateSteps(input);

            if (input.length === 0) {
              expect(events).toHaveLength(0);
              return;
            }

            expect(events.length).toBeGreaterThan(0);
            const expectedSorted = [...input].sort((a, b) => a - b);

            events.forEach((event, idx) => {
              // stepIndex ve totalSteps tutarlılığı
              expect(event.stepIndex).toBe(idx + 1);
              expect(event.totalSteps).toBe(events.length);

              // Event tipi geçerli bir StepEventType olmalı
              expect(validTypes).toContain(event.type);

              // arraySnapshot geçerli ve doğru boyutta olmalı
              expect(event.arraySnapshot).toBeDefined();
              expect(event.arraySnapshot).not.toBeNull();
              expect(event.arraySnapshot.length).toBe(input.length);

              // indices geçerli aralıkta olmalı
              event.indices.forEach((index) => {
                expect(index).toBeGreaterThanOrEqual(0);
                expect(index).toBeLessThan(input.length);
              });

              // values undefined veya NaN içermemeli
              event.values.forEach((val) => {
                expect(val).toBeDefined();
                expect(Number.isNaN(val)).toBe(false);
              });

              // stats nesnesi ve sayaçlar negatif olmamalı
              expect(event.stats).toBeDefined();
              expect(event.stats.comparisons).toBeGreaterThanOrEqual(0);
              expect(event.stats.swaps).toBeGreaterThanOrEqual(0);
              expect(event.stats.pass).toBeGreaterThanOrEqual(0);

              // sortedIndices benzersiz ve sınır aralığında olmalı
              if (event.sortedIndices) {
                const uniqueSorted = new Set(event.sortedIndices);
                expect(uniqueSorted.size).toBe(event.sortedIndices.length);
                event.sortedIndices.forEach((sIdx) => {
                  expect(sIdx).toBeGreaterThanOrEqual(0);
                  expect(sIdx).toBeLessThan(input.length);
                });
              }
            });

            // Son olay COMPLETE olmalı ve tam sıralı diziyi içermeli (sorting için)
            const lastEvent = events[events.length - 1];
            expect(lastEvent.type).toBe('COMPLETE');
            if (algorithm.metadata.category === 'sorting') {
              expect(lastEvent.arraySnapshot).toEqual(expectedSorted);
            } else {
              expect(lastEvent.arraySnapshot).toEqual(input);
            }
          });
        });
      });
    });
  });

  describe('2. COMPARE Event Tutarlılık Testleri', () => {
    it('Bubble, Selection, Quick Sort - COMPARE verileri snapshot ile eşleşmeli', () => {
      const algos = ['bubble-sort', 'selection-sort', 'quick-sort'];
      const input = [8, 3, 5, 1];

      algos.forEach((id) => {
        const algo = getAlgorithmById(id)!;
        const events = algo.generateSteps(input);
        const compareEvents = events.filter((e) => e.type === 'COMPARE');

        compareEvents.forEach((e) => {
          expect(e.indices.length).toBeGreaterThanOrEqual(2);
          const idxA = e.indices[0];
          const idxB = e.indices[1];

          expect(e.values[0]).toBe(e.arraySnapshot[idxA]);
          expect(e.values[1]).toBe(e.arraySnapshot[idxB]);
        });
      });
    });

    it('Insertion Sort - COMPARE verileri anahtar (key) ve karşılaştırılan eleman tutarlılığı', () => {
      const algo = getAlgorithmById('insertion-sort')!;
      const input = [8, 3, 5, 1];
      const events = algo.generateSteps(input);
      const compareEvents = events.filter((e) => e.type === 'COMPARE');

      compareEvents.forEach((e) => {
        expect(e.indices.length).toBe(2);
        const idxA = e.indices[0];
        // Sol eleman snapshot üzerinde doğrudan doğrulanabilir
        expect(e.values[0]).toBe(e.arraySnapshot[idxA]);
        // Elimizdeki anahtar (key) eleman tanımlı olmalı
        expect(e.values[1]).toBeDefined();
      });
    });

    it('Merge Sort - COMPARE verileri sol ve sağ grup karşılaştırma değerlerini içermeli', () => {
      const algo = getAlgorithmById('merge-sort')!;
      const input = [8, 3, 5, 1];
      const events = algo.generateSteps(input);
      const compareEvents = events.filter((e) => e.type === 'COMPARE');

      compareEvents.forEach((e) => {
        expect(e.indices.length).toBe(2);
        expect(e.values[0]).toBeDefined();
        expect(e.values[1]).toBeDefined();
      });
    });
  });

  describe('3. SWAP Event Tutarlılık Testleri', () => {
    ALL_ARRAY_ALGORITHMS.forEach((algorithm) => {
      it(`${algorithm.metadata.name} - SWAP verileri geçerli indeks ve snapshot tutarlılığı sağlamalı`, () => {
        const input = [8, 3, 5, 1];
        const events = algorithm.generateSteps(input);
        const swapEvents = events.filter((e) => e.type === 'SWAP');

        swapEvents.forEach((e) => {
          expect(e.indices.length).toBe(2);
          const [idxA, idxB] = e.indices;

          expect(idxA).toBeGreaterThanOrEqual(0);
          expect(idxB).toBeGreaterThanOrEqual(0);

          // SWAP gerçekleştiği andaki snapshot değerleri event.values ile eşleşmeli
          expect(e.values[0]).toBe(e.arraySnapshot[idxA]);
          expect(e.values[1]).toBe(e.arraySnapshot[idxB]);
        });
      });
    });
  });

  describe('4. OVERWRITE / INSERT / SELECT_MIN Tutarlılık Testleri', () => {
    it('Selection Sort - SELECT_MIN indeksleri snapshot ile uyumlu olmalı', () => {
      const selectionAlgo = getAlgorithmById('selection-sort');
      if (!selectionAlgo) return;

      const input = [9, 2, 7, 4];
      const events = selectionAlgo.generateSteps(input);
      const minEvents = events.filter((e) => e.type === 'SELECT_MIN');

      minEvents.forEach((e) => {
        expect(e.indices.length).toBeGreaterThanOrEqual(1);
        const idx = e.indices[0];
        expect(e.values[0]).toBe(e.arraySnapshot[idx]);
      });
    });

    it('Insertion Sort - INSERT ve OVERWRITE eleman yerleştirme tutarlılığı', () => {
      const insertionAlgo = getAlgorithmById('insertion-sort');
      if (!insertionAlgo) return;

      const input = [5, 2, 4, 1];
      const events = insertionAlgo.generateSteps(input);
      const insertEvents = events.filter((e) => e.type === 'INSERT');
      const overwriteEvents = events.filter((e) => e.type === 'OVERWRITE');

      insertEvents.forEach((e) => {
        expect(e.indices[0]).toBeGreaterThanOrEqual(0);
        expect(e.values[0]).toBeDefined();
      });

      overwriteEvents.forEach((e) => {
        const targetIdx = e.indices[0];
        expect(targetIdx).toBeGreaterThanOrEqual(0);
        expect(targetIdx).toBeLessThan(input.length);
        expect(e.arraySnapshot.length).toBe(input.length);
      });
    });
  });

  describe('5. Quick Sort Özel Olay (PIVOT_SELECT & PARTITION_COMPLETE) Testleri', () => {
    it('Quick Sort pivotIndex ve subArrayRange sınırları geçerli olmalı', () => {
      const quickAlgo = getAlgorithmById('quick-sort');
      if (!quickAlgo) return;

      const input = [10, 80, 30, 90, 40, 50, 70];
      const events = quickAlgo.generateSteps(input);

      const pivotEvents = events.filter(
        (e) => e.type === 'PIVOT_SELECT' || e.type === 'PARTITION_COMPLETE'
      );

      expect(pivotEvents.length).toBeGreaterThan(0);

      pivotEvents.forEach((e) => {
        if (e.pivotIndex !== undefined) {
          expect(e.pivotIndex).toBeGreaterThanOrEqual(0);
          expect(e.pivotIndex).toBeLessThan(input.length);
          expect(e.arraySnapshot[e.pivotIndex]).toBe(e.values[0]);
        }

        if (e.subArrayRange) {
          const [left, right] = e.subArrayRange;
          expect(left).toBeGreaterThanOrEqual(0);
          expect(right).toBeLessThan(input.length);
          expect(left).toBeLessThanOrEqual(right);
        }
      });

      // PARTITION_COMPLETE olaylarında pivot solundaki elemanların <= pivot, sağındakilerin >= pivot olduğunu doğrula
      const partitionCompleteEvents = events.filter((e) => e.type === 'PARTITION_COMPLETE');
      partitionCompleteEvents.forEach((e) => {
        if (e.pivotIndex !== undefined && e.subArrayRange) {
          const pivotVal = e.arraySnapshot[e.pivotIndex];
          const [left, right] = e.subArrayRange;

          for (let i = left; i < e.pivotIndex; i++) {
            expect(e.arraySnapshot[i]).toBeLessThanOrEqual(pivotVal);
          }
          for (let i = e.pivotIndex + 1; i <= right; i++) {
            expect(e.arraySnapshot[i]).toBeGreaterThanOrEqual(pivotVal);
          }
        }
      });
    });
  });

  describe('6. Merge Sort Özel Olay (SPLIT & MERGE) Testleri', () => {
    it('Merge Sort subArrayRange ve parça birleştirme tutarlılığı', () => {
      const mergeAlgo = getAlgorithmById('merge-sort');
      if (!mergeAlgo) return;

      const input = [38, 27, 43, 3, 9, 82, 10];
      const events = mergeAlgo.generateSteps(input);

      const splitEvents = events.filter((e) => e.type === 'SPLIT');
      const mergeEvents = events.filter((e) => e.type === 'MERGE');

      expect(splitEvents.length).toBeGreaterThan(0);
      expect(mergeEvents.length).toBeGreaterThan(0);

      splitEvents.forEach((e) => {
        expect(e.subArrayRange).toBeDefined();
        if (e.subArrayRange) {
          const [left, right] = e.subArrayRange;
          expect(left).toBeGreaterThanOrEqual(0);
          expect(right).toBeLessThan(input.length);
          expect(left).toBeLessThanOrEqual(right);
        }
      });

      mergeEvents.forEach((e) => {
        expect(e.subArrayRange).toBeDefined();
        expect(e.arraySnapshot.length).toBe(input.length);
      });
    });
  });

  describe('7. Monotonik İstatistik (Stats Monotonic Non-Decreasing) Testleri', () => {
    ALL_ARRAY_ALGORITHMS.forEach((algorithm) => {
      it(`${algorithm.metadata.name} - comparisons ve swaps sayaçları geriye gitmemeli`, () => {
        const input = [6, 3, 8, 2, 9, 1];
        const events = algorithm.generateSteps(input);

        // Sıralanmamış bir dizide karşılaştırma sayısı > 0 olmalı
        const lastStats = events[events.length - 1].stats;
        expect(lastStats.comparisons).toBeGreaterThan(0);

        for (let i = 0; i < events.length - 1; i++) {
          const currentStats = events[i].stats;
          const nextStats = events[i + 1].stats;

          expect(nextStats.comparisons).toBeGreaterThanOrEqual(currentStats.comparisons);
          expect(nextStats.swaps).toBeGreaterThanOrEqual(currentStats.swaps);
        }
      });
    });
  });

  describe('8. Algoritmaya Özel Olay Türlerinin Varlığı', () => {
    it('Bubble Sort gerekli olay türlerini üretmeli', () => {
      const algo = getAlgorithmById('bubble-sort')!;
      const events = algo.generateSteps([4, 3, 2, 1]);
      const types = events.map((e) => e.type);

      expect(types).toContain('COMPARE');
      expect(types).toContain('SWAP');
      expect(types).toContain('PASS_COMPLETE');
      expect(types).toContain('COMPLETE');
    });

    it('Selection Sort gerekli olay türlerini üretmeli', () => {
      const algo = getAlgorithmById('selection-sort')!;
      const events = algo.generateSteps([4, 3, 2, 1]);
      const types = events.map((e) => e.type);

      expect(types).toContain('SELECT_MIN');
      expect(types).toContain('COMPARE');
      expect(types).toContain('SWAP');
      expect(types).toContain('COMPLETE');
    });

    it('Insertion Sort gerekli olay türlerini üretmeli', () => {
      const algo = getAlgorithmById('insertion-sort')!;
      const events = algo.generateSteps([4, 3, 2, 1]);
      const types = events.map((e) => e.type);

      expect(types).toContain('INSERT');
      expect(types).toContain('COMPARE');
      expect(types).toContain('OVERWRITE');
      expect(types).toContain('COMPLETE');
    });

    it('Merge Sort gerekli olay türlerini üretmeli', () => {
      const algo = getAlgorithmById('merge-sort')!;
      const events = algo.generateSteps([4, 3, 2, 1]);
      const types = events.map((e) => e.type);

      expect(types).toContain('SPLIT');
      expect(types).toContain('COMPARE');
      expect(types).toContain('MERGE');
      expect(types).toContain('OVERWRITE');
      expect(types).toContain('COMPLETE');
    });

    it('Quick Sort gerekli olay türlerini üretmeli', () => {
      const algo = getAlgorithmById('quick-sort')!;
      const events = algo.generateSteps([4, 3, 2, 1]);
      const types = events.map((e) => e.type);

      expect(types).toContain('PIVOT_SELECT');
      expect(types).toContain('COMPARE');
      expect(types).toContain('PARTITION_COMPLETE');
      expect(types).toContain('COMPLETE');
    });
  });

  describe('3. Graf Algoritmaları (BFS & DFS) Olay Yapısı Değişmezleri', () => {
    ALL_GRAPH_ALGORITHMS.forEach((graphAlgo) => {
      it(`${graphAlgo.metadata.name} geçerli GraphSimulationEvent dizisi üretmeli`, () => {
        const events = graphAlgo.generateSteps(DEFAULT_GRAPH_PRESET, 'A');
        expect(events.length).toBeGreaterThan(0);

        events.forEach((ev, idx) => {
          expect(ev.stepIndex).toBe(idx + 1);
          expect(ev.totalSteps).toBe(events.length);
          expect(ev.stats).toBeDefined();
          expect(ev.stats.visitedCount).toBeGreaterThanOrEqual(0);
          expect(ev.visitedNodeIds).toBeDefined();
          expect(ev.frontierNodeIds).toBeDefined();
        });

        const lastEvent = events[events.length - 1];
        expect(lastEvent.type).toBe('COMPLETE');
      });
    });
  });
});
