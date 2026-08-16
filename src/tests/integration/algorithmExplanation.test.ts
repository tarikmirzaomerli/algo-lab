import { describe, it, expect } from 'vitest';
import { ALL_ARRAY_ALGORITHMS, getAlgorithmById } from '../../core/algorithms';
import { enrichSimulationEvents } from '../../core/explanations/explanationEngine';

describe('Algorithm → SimulationEvent → Explanation Integration', () => {
  const sampleInput = [8, 3, 5, 1];

  ALL_ARRAY_ALGORITHMS.forEach((algorithm) => {
    describe(`Algorithm Pipeline: ${algorithm.metadata.name}`, () => {
      it('Bütünsel boru hattı: Ham olaylar Explanation Engine ile başarıyla zenginleştirilmeli', () => {
        const inputToUse =
          algorithm.metadata.id === 'binary-search' ||
          algorithm.metadata.id === 'jump-search' ||
          algorithm.metadata.id === 'exponential-search' ||
          algorithm.metadata.id === 'interpolation-search'
            ? [...sampleInput].sort((a, b) => a - b)
            : sampleInput;
        const rawEvents = algorithm.generateSteps(inputToUse);
        const enrichedSteps = enrichSimulationEvents(rawEvents);

        // 1. Olay sayısı birebir korunmalı
        expect(enrichedSteps.length).toBe(rawEvents.length);

        // 2. Her bir adım ham veri + zenginleştirilmiş metinleri eksiksiz taşımalı
        enrichedSteps.forEach((step, idx) => {
          const raw = rawEvents[idx];

          // Ham verilerin korunumu
          expect(step.stepIndex).toBe(raw.stepIndex);
          expect(step.totalSteps).toBe(raw.totalSteps);
          expect(step.type).toBe(raw.type);
          expect(step.indices).toEqual(raw.indices);
          expect(step.values).toEqual(raw.values);
          expect(step.arraySnapshot).toEqual(raw.arraySnapshot);
          expect(step.stats).toEqual(raw.stats);
          expect(step.pivotIndex).toBe(raw.pivotIndex);
          expect(step.subArrayRange).toEqual(raw.subArrayRange);

          // Anlatım metinlerinin varlığı, kalitesi ve bozuk placeholder içermemesi
          expect(typeof step.title).toBe('string');
          expect(step.title.trim().length).toBeGreaterThan(3);
          expect(step.title).not.toContain('undefined');
          expect(step.title).not.toContain('NaN');
          expect(step.title).not.toContain('[object Object]');

          expect(typeof step.description).toBe('string');
          expect(step.description.trim().length).toBeGreaterThan(10);
          expect(step.description).not.toContain('undefined');
          expect(step.description).not.toContain('NaN');
          expect(step.description).not.toContain('[object Object]');
        });

        // 3. Son adım COMPLETE olmalı ve tamamlanma özeti içermeli
        const lastStep = enrichedSteps[enrichedSteps.length - 1];
        expect(lastStep.type).toBe('COMPLETE');
        const expectedTitle =
          algorithm.metadata.category === 'searching'
            ? 'Arama Başarıyla Tamamlandı!'
            : 'Sıralama Başarıyla Tamamlandı!';
        expect(lastStep.title).toBe(expectedTitle);
        expect(lastStep.description).toContain('karşılaştırma');
      });
    });
  });

  describe('Merge Sort Özel Entegrasyon Testleri', () => {
    it('SPLIT ve MERGE olayları alt dizi aralıklarıyla (subArrayRange) metne doğru aktarılmalı', () => {
      const mergeAlgo = getAlgorithmById('merge-sort')!;
      const rawEvents = mergeAlgo.generateSteps([38, 27, 43, 3]);
      const enrichedSteps = enrichSimulationEvents(rawEvents);

      const splitSteps = enrichedSteps.filter((s) => s.type === 'SPLIT');
      const mergeSteps = enrichedSteps.filter((s) => s.type === 'MERGE');

      expect(splitSteps.length).toBeGreaterThan(0);
      expect(mergeSteps.length).toBeGreaterThan(0);

      splitSteps.forEach((step) => {
        expect(step.subArrayRange).toBeDefined();
        expect(step.title).toBe('Dizi İkiye Bölünüyor (Split)');
        expect(step.description).toContain('indeksleri arasındaki parça');
      });

      mergeSteps.forEach((step) => {
        expect(step.subArrayRange).toBeDefined();
        expect(step.title).toBe('İki Sıralı Parça Birleştiriliyor (Merge)');
        expect(step.description).toContain('aralığındaki sol ve sağ sıralı gruplar');
      });
    });
  });

  describe('Quick Sort Özel Entegrasyon Testleri', () => {
    it('PIVOT_SELECT ve PARTITION_COMPLETE olayları pivot metinlerine doğru aktarılmalı', () => {
      const quickAlgo = getAlgorithmById('quick-sort')!;
      const rawEvents = quickAlgo.generateSteps([10, 80, 30, 90, 40]);
      const enrichedSteps = enrichSimulationEvents(rawEvents);

      const pivotSelectSteps = enrichedSteps.filter((s) => s.type === 'PIVOT_SELECT');
      const partitionCompleteSteps = enrichedSteps.filter((s) => s.type === 'PARTITION_COMPLETE');

      expect(pivotSelectSteps.length).toBeGreaterThan(0);
      expect(partitionCompleteSteps.length).toBeGreaterThan(0);

      pivotSelectSteps.forEach((step) => {
        expect(step.pivotIndex).toBeDefined();
        expect(step.title).toContain('Pivot Eleman Seçildi');
        expect(step.description).toContain('hedef referans sayımız (Pivot)');
      });

      partitionCompleteSteps.forEach((step) => {
        expect(step.pivotIndex).toBeDefined();
        expect(step.title).toContain('Partition Tamamlandı');
        expect(step.description).toContain('tam olması gereken konuma');
      });
    });
  });

  describe('Edge Case Entegrasyon Testleri', () => {
    const edgeCases = [
      { name: 'Boş dizi', input: [] },
      { name: 'Tek elemanlı dizi', input: [42] },
      { name: 'Zaten sıralı dizi', input: [1, 2, 3, 4, 5] },
      { name: 'Ters sıralı dizi', input: [5, 4, 3, 2, 1] },
      { name: 'Tekrarlı elemanlar', input: [5, 2, 5, 1, 2, 5] },
      { name: 'Negatif sayılar', input: [-5, 3, -10, 0] },
      { name: 'Tamamı aynı elemanlar', input: [4, 4, 4, 4] },
    ];

    ALL_ARRAY_ALGORITHMS.forEach((algorithm) => {
      describe(`Algorithm Edge Cases: ${algorithm.metadata.name}`, () => {
        edgeCases.forEach(({ name, input }) => {
          it(`Uç senaryoda boru hattı çökmeden çalışmalı: ${name}`, () => {
            const rawEvents = algorithm.generateSteps(input);
            const enrichedSteps = enrichSimulationEvents(rawEvents);

            if (input.length === 0) {
              expect(enrichedSteps).toHaveLength(0);
              return;
            }

            expect(enrichedSteps.length).toBeGreaterThan(0);

            enrichedSteps.forEach((step) => {
              expect(typeof step.title).toBe('string');
              expect(step.title.trim().length).toBeGreaterThan(3);
              expect(step.title).not.toContain('undefined');
              expect(step.title).not.toContain('NaN');

              expect(typeof step.description).toBe('string');
              expect(step.description.trim().length).toBeGreaterThan(10);
              expect(step.description).not.toContain('undefined');
              expect(step.description).not.toContain('NaN');

              expect(step.arraySnapshot.length).toBe(input.length);
            });
          });
        });
      });
    });
  });

  describe('Event / Explanation Anlamsal Tutarlılık Testleri', () => {
    it('COMPARE adımlarında formula ve metin değerleri tutarlı olmalı', () => {
      const bubbleAlgo = getAlgorithmById('bubble-sort')!;
      const rawEvents = bubbleAlgo.generateSteps([8, 3]);
      const enrichedSteps = enrichSimulationEvents(rawEvents);

      const compareStep = enrichedSteps.find((s) => s.type === 'COMPARE')!;
      expect(compareStep).toBeDefined();
      expect(compareStep.title).toContain('8');
      expect(compareStep.title).toContain('3');
      expect(compareStep.formula).toBe('8 > 3');
    });

    it('SWAP adımlarında formula ve metin değerleri tutarlı olmalı', () => {
      const bubbleAlgo = getAlgorithmById('bubble-sort')!;
      const rawEvents = bubbleAlgo.generateSteps([8, 3]);
      const enrichedSteps = enrichSimulationEvents(rawEvents);

      const swapStep = enrichedSteps.find((s) => s.type === 'SWAP')!;
      expect(swapStep).toBeDefined();
      expect(swapStep.title).toContain('Swap');
      expect(swapStep.formula).toBe('[8, 3] → [3, 8]');
    });
  });
});
