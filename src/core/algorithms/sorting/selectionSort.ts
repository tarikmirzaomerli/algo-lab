import type { ArrayAlgorithm, AlgorithmMetadata } from '../../../types/algorithm';
import type { SimulationEvent } from '../../../types/event';

export const selectionSortMetadata: AlgorithmMetadata = {
  id: 'selection-sort',
  name: 'Selection Sort (Seçmeli Sıralama)',
  category: 'sorting',
  description:
    'Her turda dizinin sıralanmamış bölümündeki en küçük elemanı bularak sırasıyla dizinin başına yerleştiren algoritmadır.',
  howItWorks: [
    'Dizinin henüz sıralanmamış kısmındaki en küçük eleman aranır (SELECT_MIN).',
    'Bulunan en küçük eleman, sıralanmamış kısmın en başındaki eleman ile yer değiştirilir (SWAP).',
    'Sıralanmış alan bir eleman genişletilir ve aynı işlem dizi bitene kadar tekrarlanır.',
  ],
  realWorldApplications: [
    'Bellek yazma (write) operasyonlarının çok pahalı olduğu sistemler (Flash bellekler vb., çünkü maksimum n-1 swap yapar).',
    'Küçük dizilerde veya ek bellek kullanımının (O(1)) kritik olduğu gömülü sistemler.',
  ],
  complexity: {
    time: {
      best: 'O(n²)',
      average: 'O(n²)',
      worst: 'O(n²)',
    },
    space: 'O(1)',
  },
  properties: { stable: false, inPlace: true },
};

export const selectionSort: ArrayAlgorithm = {
  metadata: selectionSortMetadata,

  generateSteps(initialArray: number[]): SimulationEvent[] {
    const steps: SimulationEvent[] = [];
    const arr = [...initialArray];
    const n = arr.length;
    let comparisons = 0;
    let swaps = 0;
    const sortedIndices: number[] = [];

    if (n === 0) return steps;

    for (let i = 0; i < n - 1; i++) {
      let minIdx = i;

      steps.push({
        stepIndex: 0,
        totalSteps: 0,
        type: 'SELECT_MIN',
        indices: [i],
        values: [arr[i]],
        arraySnapshot: [...arr],
        sortedIndices: [...sortedIndices],
        stats: { comparisons, swaps, pass: i + 1 },
      });

      for (let j = i + 1; j < n; j++) {
        comparisons++;
        const currentMinVal = arr[minIdx];
        const candidateVal = arr[j];

        steps.push({
          stepIndex: 0,
          totalSteps: 0,
          type: 'COMPARE',
          indices: [minIdx, j],
          values: [currentMinVal, candidateVal],
          arraySnapshot: [...arr],
          sortedIndices: [...sortedIndices],
          stats: { comparisons, swaps, pass: i + 1 },
        });

        if (arr[j] < arr[minIdx]) {
          minIdx = j;
          steps.push({
            stepIndex: 0,
            totalSteps: 0,
            type: 'SELECT_MIN',
            indices: [minIdx],
            values: [arr[minIdx]],
            arraySnapshot: [...arr],
            sortedIndices: [...sortedIndices],
            stats: { comparisons, swaps, pass: i + 1 },
            meta: { kind: 'selection-sort', isMinCandidate: true },
          });
        }
      }

      if (minIdx !== i) {
        swaps++;
        const valA = arr[i];
        const valB = arr[minIdx];

        arr[i] = valB;
        arr[minIdx] = valA;

        steps.push({
          stepIndex: 0,
          totalSteps: 0,
          type: 'SWAP',
          indices: [i, minIdx],
          values: [valB, valA],
          arraySnapshot: [...arr],
          sortedIndices: [...sortedIndices],
          stats: { comparisons, swaps, pass: i + 1 },
        });
      } else {
        steps.push({
          stepIndex: 0,
          totalSteps: 0,
          type: 'PASS_COMPLETE',
          indices: [i],
          values: [arr[i]],
          arraySnapshot: [...arr],
          sortedIndices: [...sortedIndices],
          stats: { comparisons, swaps, pass: i + 1 },
        });
      }

      sortedIndices.push(i);
    }

    sortedIndices.push(n - 1);

    steps.push({
      stepIndex: 0,
      totalSteps: 0,
      type: 'COMPLETE',
      indices: [],
      values: [],
      arraySnapshot: [...arr],
      sortedIndices: Array.from({ length: n }, (_, idx) => idx),
      stats: { comparisons, swaps, pass: n },
    });

    const total = steps.length;
    return steps.map((s, idx) => ({
      ...s,
      stepIndex: idx + 1,
      totalSteps: total,
    }));
  },
};
