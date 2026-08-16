import type { ArrayAlgorithm, AlgorithmMetadata } from '../../../types/algorithm';
import type { SimulationEvent } from '../../../types/event';

export const mergeSortMetadata: AlgorithmMetadata = {
  id: 'merge-sort',
  name: 'Merge Sort (Birleştirmeli Sıralama)',
  category: 'sorting',
  recursionSupported: true,
  description:
    'Merge Sort, "Böl ve Yönet" (Divide and Conquer) mantığını kullanır. Devasa bir problemi küçük parçalara bölüp çözer, sonra sonuçları pürüzsüzce birleştirir.',
  howItWorks: [
    'Bölme (Split): Dizi tam ortadan sol ve sağ olmak üzere iki eşit parçaya bölünür.',
    'Özyineleme (Recursion): Parçalar tek bir eleman kalana kadar bölünmeye devam eder (1 elemanlı dizi sıralıdır).',
    'Birleştirme (Merge): İki sıralı parça en küçük elemanları karşılaştırılarak adım adım tek bir sıralı liste halinde birleştirilir.',
  ],
  realWorldApplications: [
    'Harici Sıralama (External Sorting - Devasa Veriler): RAM belleğe sığmayacak kadar büyük veritabanı dosyaları (Örn: 100 GB log dosyası) diske parçalanıp Merge Sort ile sıralanır.',
    'E-Ticaret ve Veritabanı Sorguları (Stable Sorting): Ürünleri önce fiyata, sonra puana göre sıralarken önceki sıralama sırasını bozmaz (Kararlıdır / Stable).',
    'Bağlı Liste (Linked List) Sıralama: Rastgele erişim gerektirmediği için Linked List yapılarında O(n log n) süreyle sıralama yapmanın en ideal yoludur.',
  ],
  complexity: {
    time: { best: 'O(n log n)', average: 'O(n log n)', worst: 'O(n log n)' },
    space: 'O(n)',
  },
  properties: { stable: true, inPlace: false },
};

export const mergeSort: ArrayAlgorithm = {
  metadata: mergeSortMetadata,

  generateSteps(initialArray: number[]): SimulationEvent[] {
    const steps: SimulationEvent[] = [];
    const arr = [...initialArray];
    const n = arr.length;
    let comparisons = 0;
    let swaps = 0;
    const sortedIndices: number[] = [];

    if (n === 0) return steps;

    function mergeSortRecursive(left: number, right: number, depth: number) {
      if (left >= right) return;

      const mid = Math.floor((left + right) / 2);

      steps.push({
        stepIndex: 0,
        totalSteps: 0,
        type: 'SPLIT',
        indices: Array.from({ length: right - left + 1 }, (_, i) => left + i),
        values: arr.slice(left, right + 1),
        arraySnapshot: [...arr],
        sortedIndices: [...sortedIndices],
        subArrayRange: [left, right],
        stats: { comparisons, swaps, pass: depth },
        recursionFrame: `mergeSort(sol: ${left}, sağ: ${right})`,
      });

      mergeSortRecursive(left, mid, depth + 1);
      mergeSortRecursive(mid + 1, right, depth + 1);

      merge(left, mid, right, depth);
    }

    function merge(left: number, mid: number, right: number, depth: number) {
      const leftArr = arr.slice(left, mid + 1);
      const rightArr = arr.slice(mid + 1, right + 1);

      steps.push({
        stepIndex: 0,
        totalSteps: 0,
        type: 'MERGE',
        indices: Array.from({ length: right - left + 1 }, (_, i) => left + i),
        values: arr.slice(left, right + 1),
        arraySnapshot: [...arr],
        sortedIndices: [...sortedIndices],
        subArrayRange: [left, right],
        stats: { comparisons, swaps, pass: depth },
        recursionFrame: `merge(sol: ${left}, orta: ${mid}, sağ: ${right})`,
      });

      let i = 0;
      let j = 0;
      let k = left;

      while (i < leftArr.length && j < rightArr.length) {
        comparisons++;
        const valL = leftArr[i];
        const valR = rightArr[j];

        steps.push({
          stepIndex: 0,
          totalSteps: 0,
          type: 'COMPARE',
          indices: [left + i, mid + 1 + j],
          values: [valL, valR],
          arraySnapshot: [...arr],
          sortedIndices: [...sortedIndices],
          subArrayRange: [left, right],
          stats: { comparisons, swaps, pass: depth },
        });

        if (valL <= valR) {
          swaps++;
          arr[k] = valL;
          steps.push({
            stepIndex: 0,
            totalSteps: 0,
            type: 'OVERWRITE',
            indices: [k],
            values: [valL],
            arraySnapshot: [...arr],
            sortedIndices: [...sortedIndices],
            subArrayRange: [left, right],
            stats: { comparisons, swaps, pass: depth },
          });
          i++;
        } else {
          swaps++;
          arr[k] = valR;
          steps.push({
            stepIndex: 0,
            totalSteps: 0,
            type: 'OVERWRITE',
            indices: [k],
            values: [valR],
            arraySnapshot: [...arr],
            sortedIndices: [...sortedIndices],
            subArrayRange: [left, right],
            stats: { comparisons, swaps, pass: depth },
          });
          j++;
        }
        k++;
      }

      while (i < leftArr.length) {
        swaps++;
        arr[k] = leftArr[i];
        steps.push({
          stepIndex: 0,
          totalSteps: 0,
          type: 'OVERWRITE',
          indices: [k],
          values: [leftArr[i]],
          arraySnapshot: [...arr],
          sortedIndices: [...sortedIndices],
          subArrayRange: [left, right],
          stats: { comparisons, swaps, pass: depth },
        });
        i++;
        k++;
      }

      while (j < rightArr.length) {
        swaps++;
        arr[k] = rightArr[j];
        steps.push({
          stepIndex: 0,
          totalSteps: 0,
          type: 'OVERWRITE',
          indices: [k],
          values: [rightArr[j]],
          arraySnapshot: [...arr],
          sortedIndices: [...sortedIndices],
          subArrayRange: [left, right],
          stats: { comparisons, swaps, pass: depth },
        });
        j++;
        k++;
      }

      if (left === 0 && right === n - 1) {
        for (let idx = 0; idx < n; idx++) {
          if (!sortedIndices.includes(idx)) sortedIndices.push(idx);
        }
      }
    }

    mergeSortRecursive(0, n - 1, 1);

    steps.push({
      stepIndex: 0,
      totalSteps: 0,
      type: 'COMPLETE',
      indices: [],
      values: [],
      arraySnapshot: [...arr],
      sortedIndices: Array.from({ length: n }, (_, idx) => idx),
      stats: { comparisons, swaps, pass: 1 },
    });

    const total = steps.length;
    return steps.map((s, idx) => ({
      ...s,
      stepIndex: idx + 1,
      totalSteps: total,
    }));
  },
};
