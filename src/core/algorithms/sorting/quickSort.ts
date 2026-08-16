import type { ArrayAlgorithm, AlgorithmMetadata } from '../../../types/algorithm';
import type { SimulationEvent } from '../../../types/event';

export const quickSortMetadata: AlgorithmMetadata = {
  id: 'quick-sort',
  name: 'Quick Sort (Hızlı Sıralama)',
  category: 'sorting',
  pivotSupported: true,
  recursionSupported: true,
  description:
    'Quick Sort, ortalama senaryoda dünyanın en hızlı sıralama algoritması kabul edilir. Bir "Pivot" eleman seçer, pivottan küçükleri sola, büyükleri sağa toplar.',
  howItWorks: [
    'Pivot Seçimi: Diziden nirengi noktası olarak bir "Pivot" elemanı seçilir (genellikle son eleman).',
    'Bölümleme (Partition): Tüm elemanlar pivot ile karşılaştırılır; pivottan küçük sayılar sol bölüme, büyükler sağ bölüme toplanır.',
    'Pivotun Konumlanması: Pivot elemanı tam bu iki grubun arasına (doğru yerine) yerleştirilir.',
    'Özyineleme: Sol ve sağ alt gruplar için aynı işlem bağımsız olarak tekrarlanır.',
  ],
  realWorldApplications: [
    'Standart Programlama Dili Kütüphaneleri: C dilindeki `qsort()`, C++ `std::sort` ve Java `Arrays.sort()` (primitive tipler için Dual-Pivot Quicksort) varsayılan olarak Quick Sort türevlerini kullanır.',
    'Oyun Motorları ve Skorbordlar: Oyuncu puanlarını veya 3D grafik motorlarında nesnelerin derinlik sıralamasını (Z-buffer) en hızlı şekilde hesaplamak için tercih edilir.',
    'Büyük Veri Analitiği: Bellek içi (In-Memory) devasa veri dizilerini sıralamada bellek verimliliği (O(log n) ek bellek) nedeniyle 1 numaralı tercihtir.',
  ],
  complexity: {
    time: { best: 'O(n log n)', average: 'O(n log n)', worst: 'O(n²)' },
    space: 'O(log n)',
  },
  properties: { stable: false, inPlace: true },
};

export const quickSort: ArrayAlgorithm = {
  metadata: quickSortMetadata,

  generateSteps(initialArray: number[]): SimulationEvent[] {
    const steps: SimulationEvent[] = [];
    const arr = [...initialArray];
    const n = arr.length;
    let comparisons = 0;
    let swaps = 0;
    const sortedIndices: number[] = [];

    if (n === 0) return steps;

    function quickSortRecursive(low: number, high: number, depth: number) {
      if (low < high) {
        const pivotIndex = partition(low, high, depth);
        sortedIndices.push(pivotIndex);

        quickSortRecursive(low, pivotIndex - 1, depth + 1);
        quickSortRecursive(pivotIndex + 1, high, depth + 1);
      } else if (low === high) {
        if (!sortedIndices.includes(low)) {
          sortedIndices.push(low);
        }
      }
    }

    function partition(low: number, high: number, depth: number): number {
      const pivotVal = arr[high];
      const pivotIdx = high;

      steps.push({
        stepIndex: 0,
        totalSteps: 0,
        type: 'PIVOT_SELECT',
        indices: [pivotIdx],
        values: [pivotVal],
        arraySnapshot: [...arr],
        sortedIndices: [...sortedIndices],
        pivotIndex: pivotIdx,
        subArrayRange: [low, high],
        stats: { comparisons, swaps, pass: depth },
        recursionFrame: `quickSort(düşük: ${low}, yüksek: ${high})`,
      });

      let i = low - 1;

      for (let j = low; j < high; j++) {
        comparisons++;
        const currentVal = arr[j];

        steps.push({
          stepIndex: 0,
          totalSteps: 0,
          type: 'COMPARE',
          indices: [j, pivotIdx],
          values: [currentVal, pivotVal],
          arraySnapshot: [...arr],
          sortedIndices: [...sortedIndices],
          pivotIndex: pivotIdx,
          subArrayRange: [low, high],
          stats: { comparisons, swaps, pass: depth },
          recursionFrame: `quickSort(sol: ${low}, sağ: ${high})`,
        });

        if (arr[j] < pivotVal) {
          i++;
          if (i !== j) {
            swaps++;
            const valA = arr[i];
            const valB = arr[j];
            arr[i] = valB;
            arr[j] = valA;

            steps.push({
              stepIndex: 0,
              totalSteps: 0,
              type: 'SWAP',
              indices: [i, j],
              values: [valB, valA],
              arraySnapshot: [...arr],
              sortedIndices: [...sortedIndices],
              pivotIndex: pivotIdx,
              subArrayRange: [low, high],
              stats: { comparisons, swaps, pass: depth },
            });
          }
        }
      }

      const targetPivotPos = i + 1;
      swaps++;
      const oldValAtPos = arr[targetPivotPos];
      arr[targetPivotPos] = pivotVal;
      arr[high] = oldValAtPos;

      steps.push({
        stepIndex: 0,
        totalSteps: 0,
        type: 'PARTITION_COMPLETE',
        indices: [targetPivotPos, high],
        values: [pivotVal, oldValAtPos],
        arraySnapshot: [...arr],
        sortedIndices: [...sortedIndices, targetPivotPos],
        pivotIndex: targetPivotPos,
        subArrayRange: [low, high],
        stats: { comparisons, swaps, pass: depth },
      });

      return targetPivotPos;
    }

    quickSortRecursive(0, n - 1, 1);

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
