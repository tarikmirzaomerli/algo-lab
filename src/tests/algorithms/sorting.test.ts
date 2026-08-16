import { describe, it, expect } from 'vitest';
import { SORTING_ALGORITHMS } from '../../core/algorithms';

describe('Sorting Algorithms - Unit & Step Consistency Tests', () => {
  const testCases = [
    { name: 'Boş dizi', input: [] },
    { name: 'Tek elemanlı dizi', input: [42] },
    { name: 'Zaten sıralı dizi', input: [1, 2, 3, 4, 5] },
    { name: 'Ters sıralı dizi', input: [5, 4, 3, 2, 1] },
    { name: 'Rastgele dizi', input: [8, 3, 5, 1, 6, 9, 2, 7] },
    { name: 'Tekrarlı elemanlar içeren dizi', input: [5, 2, 5, 1, 2, 5] },
  ];

  Object.values(SORTING_ALGORITHMS).forEach((algorithm) => {
    describe(`Algorithm: ${algorithm.metadata.name}`, () => {
      testCases.forEach(({ name, input }) => {
        it(`Doğru sıralama yapmalı: ${name}`, () => {
          const expected = [...input].sort((a, b) => a - b);
          const steps = algorithm.generateSteps(input);

          if (input.length === 0) {
            expect(steps.length).toBe(0);
            return;
          }

          const lastStep = steps[steps.length - 1];

          // 1. Nihai dizinin eleman sayısı tam korunmalı (Veri kaybı olmamalı)
          expect(lastStep.arraySnapshot.length).toBe(input.length);

          // 2. Nihai dizi sıralı beklentiye eşit olmalı
          expect(lastStep.arraySnapshot).toEqual(expected);

          // 3. Ardışık her eleman çifti non-decreasing sıralamada olmalı
          for (let i = 0; i < lastStep.arraySnapshot.length - 1; i++) {
            expect(lastStep.arraySnapshot[i]).toBeLessThanOrEqual(
              lastStep.arraySnapshot[i + 1]
            );
          }

          expect(lastStep.type).toBe('COMPLETE');
        });
      });

      it('Üretilen adımların stepIndex ve totalSteps tutarlılığı', () => {
        const input = [5, 1, 4, 2, 8];
        const steps = algorithm.generateSteps(input);

        expect(steps.length).toBeGreaterThan(0);
        steps.forEach((step, index) => {
          expect(step.stepIndex).toBe(index + 1);
          expect(step.totalSteps).toBe(steps.length);
          expect(step.arraySnapshot.length).toBe(input.length);
        });
      });
    });
  });
});
