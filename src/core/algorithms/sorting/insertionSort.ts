import type { ArrayAlgorithm, AlgorithmMetadata } from '../../../types/algorithm';
import type { SimulationEvent } from '../../../types/event';

export const insertionSortMetadata: AlgorithmMetadata = {
  id: 'insertion-sort',
  name: 'Insertion Sort (Ekleme Sıralaması)',
  category: 'sorting',
  description:
    'Dizinin elemanlarını teker teker alıp, sol taraftaki sıralanmış alt dizi içerisinde uygun konuma sokarak sıralayan algoritmadır.',
  howItWorks: [
    'Dizinin ikinci elemanından (indeks 1) başlanarak bu eleman anahtar (key) olarak seçilir.',
    'Anahtar eleman solundaki sıralı gruptaki elemanlarla sağdan sola doğru karşılaştırılır.',
    'Anahtardan büyük olan elemanlar bir pozisyon sağa kaydırılır (OVERWRITE).',
    'Uygun boşluk bulunduğunda anahtar eleman o konuma yerleştirilir (INSERT).',
  ],
  realWorldApplications: [
    'Neredeyse sıralı (nearly sorted) veri kümelerinin sıralanması (O(n) karmaşıklık gösterir).',
    'Hybrid sıralama algoritmalarında (Timsort, IntroSort) küçük alt dizilerin (16-64 eleman) sıralanmasında temel motor olarak kullanımı.',
  ],
  complexity: {
    time: {
      best: 'O(n)',
      average: 'O(n²)',
      worst: 'O(n²)',
    },
    space: 'O(1)',
  },
  properties: {
    stable: true,
    inPlace: true,
  },
};

export const insertionSort: ArrayAlgorithm = {
  metadata: insertionSortMetadata,

  generateSteps(initialArray: number[]): SimulationEvent[] {
    const steps: SimulationEvent[] = [];
    const arr = [...initialArray];
    const n = arr.length;
    let comparisons = 0;
    let swaps = 0;

    if (n === 0) return steps;

    const sortedIndices: number[] = [0];

    for (let i = 1; i < n; i++) {
      const key = arr[i];
      let j = i - 1;

      steps.push({
        stepIndex: 0,
        totalSteps: 0,
        type: 'INSERT',
        indices: [i],
        values: [key],
        arraySnapshot: [...arr],
        sortedIndices: [...sortedIndices],
        stats: { comparisons, swaps, pass: i },
        meta: { kind: 'insertion-sort', isKeySelected: true },
      });

      while (j >= 0) {
        comparisons++;
        const currentVal = arr[j];

        steps.push({
          stepIndex: 0,
          totalSteps: 0,
          type: 'COMPARE',
          indices: [j, j + 1],
          values: [currentVal, key],
          arraySnapshot: [...arr],
          sortedIndices: [...sortedIndices],
          stats: { comparisons, swaps, pass: i },
        });

        if (arr[j] > key) {
          swaps++;
          arr[j + 1] = arr[j];

          steps.push({
            stepIndex: 0,
            totalSteps: 0,
            type: 'OVERWRITE',
            indices: [j, j + 1],
            values: [arr[j], key],
            arraySnapshot: [...arr],
            sortedIndices: [...sortedIndices],
            stats: { comparisons, swaps, pass: i },
            meta: { kind: 'insertion-sort', isShift: true },
          });

          j--;
        } else {
          break;
        }
      }

      arr[j + 1] = key;
      sortedIndices.push(i);

      steps.push({
        stepIndex: 0,
        totalSteps: 0,
        type: 'INSERT',
        indices: [j + 1],
        values: [key],
        arraySnapshot: [...arr],
        sortedIndices: [...sortedIndices],
        stats: { comparisons, swaps, pass: i },
      });
    }

    steps.push({
      stepIndex: 0,
      totalSteps: 0,
      type: 'COMPLETE',
      indices: [],
      values: [],
      arraySnapshot: [...arr],
      sortedIndices: Array.from({ length: n }, (_, idx) => idx),
      stats: { comparisons, swaps, pass: n - 1 },
    });

    const total = steps.length;
    return steps.map((s, idx) => ({
      ...s,
      stepIndex: idx + 1,
      totalSteps: total,
    }));
  },
};
