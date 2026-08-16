import type { ArrayAlgorithm, AlgorithmMetadata } from '../../../types/algorithm';
import type { SimulationEvent } from '../../../types/event';

export const bubbleSortMetadata: AlgorithmMetadata = {
  id: 'bubble-sort',
  name: 'Bubble Sort (Baloncuk Sıralaması)',
  category: 'sorting',
  description:
    'Yan yana duran elemanları sürekli karşılaştırarak büyük olanları dizinin sonuna doğru kaydıran sezgisel sıralama algoritmasıdır.',
  howItWorks: [
    'Dizinin başından başlanarak komşu elemanlar (arr[i] ve arr[i+1]) karşılaştırılır.',
    'Soldaki eleman sağdakinden büyükse ikisinin yeri değiştirilir (SWAP).',
    'Her tur sonunda dizinin en büyük elemanı baloncuk gibi en sağa (doğru konumuna) yükselir.',
    'Hiçbir yer değiştirme yapılmayan bir tur gerçekleştiğinde dizi tamamen sıralanmış demektir.',
  ],
  realWorldApplications: [
    'Bilgisayar bilimleri eğitiminde sıralama mantığını öğretmek.',
    'Neredeyse sıralı küçük veri kümelerinde hızlı doğrulama.',
  ],
  complexity: {
    time: {
      best: 'O(n)',
      average: 'O(n²)',
      worst: 'O(n²)',
    },
    space: 'O(1)',
  },
  properties: { stable: true, inPlace: true },
};

export const bubbleSort: ArrayAlgorithm = {
  metadata: bubbleSortMetadata,

  generateSteps(initialArray: number[]): SimulationEvent[] {
    const steps: SimulationEvent[] = [];
    const arr = [...initialArray];
    const n = arr.length;
    let comparisons = 0;
    let swaps = 0;
    const sortedIndices: number[] = [];

    if (n === 0) return steps;
    if (n === 1) {
      steps.push({
        stepIndex: 1,
        totalSteps: 1,
        type: 'COMPLETE',
        indices: [0],
        values: [arr[0]],
        arraySnapshot: [...arr],
        sortedIndices: [0],
        stats: { comparisons: 0, swaps: 0, pass: 1 },
      });
      return steps;
    }

    let pass = 0;
    let swappedInPass: boolean;

    for (let i = 0; i < n - 1; i++) {
      pass++;
      swappedInPass = false;

      for (let j = 0; j < n - 1 - i; j++) {
        comparisons++;
        const valA = arr[j];
        const valB = arr[j + 1];

        // COMPARE Step
        steps.push({
          stepIndex: 0,
          totalSteps: 0,
          type: 'COMPARE',
          indices: [j, j + 1],
          values: [valA, valB],
          arraySnapshot: [...arr],
          sortedIndices: [...sortedIndices],
          stats: { comparisons, swaps, pass },
        });

        if (valA > valB) {
          swaps++;
          swappedInPass = true;
          arr[j] = valB;
          arr[j + 1] = valA;

          // SWAP Step
          steps.push({
            stepIndex: 0,
            totalSteps: 0,
            type: 'SWAP',
            indices: [j, j + 1],
            values: [valB, valA],
            arraySnapshot: [...arr],
            sortedIndices: [...sortedIndices],
            stats: { comparisons, swaps, pass },
          });
        }
      }

      const lastSortedIndex = n - 1 - i;
      sortedIndices.push(lastSortedIndex);

      steps.push({
        stepIndex: 0,
        totalSteps: 0,
        type: 'PASS_COMPLETE',
        indices: [lastSortedIndex],
        values: [arr[lastSortedIndex]],
        arraySnapshot: [...arr],
        sortedIndices: [...sortedIndices],
        stats: { comparisons, swaps, pass },
      });

      if (!swappedInPass) {
        for (let k = 0; k < n - 1 - i; k++) {
          if (!sortedIndices.includes(k)) sortedIndices.push(k);
        }
        break;
      }
    }

    for (let k = 0; k < n; k++) {
      if (!sortedIndices.includes(k)) sortedIndices.push(k);
    }

    steps.push({
      stepIndex: 0,
      totalSteps: 0,
      type: 'COMPLETE',
      indices: [],
      values: [],
      arraySnapshot: [...arr],
      sortedIndices: Array.from({ length: n }, (_, idx) => idx),
      stats: { comparisons, swaps, pass },
    });

    const total = steps.length;
    return steps.map((s, idx) => ({
      ...s,
      stepIndex: idx + 1,
      totalSteps: total,
    }));
  },
};
