import type { StepSnapshot, VisualizerItemMetadata } from '../../engine/types';
import type { ArrayAlgorithmState } from './bubbleSort';

export const QUICK_SORT_METADATA: VisualizerItemMetadata = {
  id: 'quick-sort',
  name: 'Quick Sort (Hızlı Sıralama)',
  shortName: 'Quick Sort',
  category: 'sorting',
  kind: 'algorithm',
  description:
    'Böl ve yönet (Divide & Conquer) stratejisiyle bir pivot eleman seçip, küçükleri soluna büyükleri sağına toplayarak rekürsif sıralama yapar.',
  complexity: {
    time: {
      best: 'O(n log n)',
      average: 'O(n log n)',
      worst: 'O(n²)',
    },
    space: 'O(log n)',
  },
  pseudocode: [
    { line: 1, code: 'function quickSort(arr, low, high):' },
    { line: 2, code: '  pivot = arr[high], i = low - 1' },
    { line: 3, code: '  for j = low to high - 1:' },
    { line: 4, code: '    if arr[j] < pivot: i++; swap(arr[i], arr[j])' },
    { line: 5, code: '  swap(arr[i + 1], arr[high]); return i + 1' },
  ],
  properties: {
    stable: false,
    inPlace: true,
  },
};

export function generateQuickSortSnapshots(initialArray: number[]): StepSnapshot<ArrayAlgorithmState>[] {
  const snapshots: StepSnapshot<ArrayAlgorithmState>[] = [];
  const arr = [...initialArray];
  const n = arr.length;
  let comparisons = 0;
  let swaps = 0;
  const sortedIndices: number[] = [];

  if (n === 0) return snapshots;

  function partition(low: number, high: number): number {
    const pivot = arr[high];
    let i = low - 1;

    snapshots.push({
      structureState: {
        array: [...arr],
        sortedIndices: [...sortedIndices],
      },
      activeIndicesOrNodes: [high],
      pointers: { low, high, pivot, i },
      operationType: 'compare',
      codeLine: 2,
      statusNote: `Pivot seçildi: arr[${high}] = ${pivot}. [${low}...${high}] aralığı bölümleniyor.`,
      metrics: {
        comparisons,
        operations: comparisons + swaps,
        swaps,
        timeComplexity: 'O(n log n)',
        spaceComplexity: 'O(log n)',
        customMetrics: { 'Pivot': pivot },
      },
    });

    for (let j = low; j < high; j++) {
      comparisons++;
      const isSmaller = arr[j] < pivot;

      snapshots.push({
        structureState: {
          array: [...arr],
          sortedIndices: [...sortedIndices],
        },
        activeIndicesOrNodes: [j, high],
        secondaryIndicesOrNodes: i >= low ? [i] : [],
        pointers: { j, pivot, i, high },
        operationType: 'compare',
        codeLine: 4,
        statusNote: `arr[${j}] (${arr[j]}) ${isSmaller ? '<' : '>='} pivot (${pivot}).`,
        metrics: {
          comparisons,
          operations: comparisons + swaps,
          swaps,
          timeComplexity: 'O(n log n)',
          spaceComplexity: 'O(log n)',
        },
      });

      if (isSmaller) {
        i++;
        if (i !== j) {
          swaps++;
          const temp = arr[i];
          arr[i] = arr[j];
          arr[j] = temp;

          snapshots.push({
            structureState: {
              array: [...arr],
              sortedIndices: [...sortedIndices],
            },
            activeIndicesOrNodes: [i, j],
            pointers: { i, j, pivot },
            operationType: 'swap',
            codeLine: 4,
            statusNote: `Küçük eleman sol bölüme alındı: arr[${i}] ile arr[${j}] takas edildi.`,
            metrics: {
              comparisons,
              operations: comparisons + swaps,
              swaps,
              timeComplexity: 'O(n log n)',
              spaceComplexity: 'O(log n)',
            },
          });
        }
      }
    }

    swaps++;
    const temp = arr[i + 1];
    arr[i + 1] = arr[high];
    arr[high] = temp;
    const pivotFinalIdx = i + 1;

    sortedIndices.push(pivotFinalIdx);

    snapshots.push({
      structureState: {
        array: [...arr],
        sortedIndices: [...sortedIndices],
      },
      activeIndicesOrNodes: [pivotFinalIdx],
      pointers: { pivot: arr[pivotFinalIdx], 'kesin_konum': pivotFinalIdx },
      operationType: 'settled',
      codeLine: 5,
      statusNote: `Pivot (${arr[pivotFinalIdx]}) kesin doğru indeksine (${pivotFinalIdx}) yerleşti.`,
      metrics: {
        comparisons,
        operations: comparisons + swaps,
        swaps,
        timeComplexity: 'O(n log n)',
        spaceComplexity: 'O(log n)',
      },
    });

    return pivotFinalIdx;
  }

  function quickSortHelper(low: number, high: number) {
    if (low < high) {
      const pi = partition(low, high);
      quickSortHelper(low, pi - 1);
      quickSortHelper(pi + 1, high);
    } else if (low === high) {
      if (!sortedIndices.includes(low)) {
        sortedIndices.push(low);
      }
    }
  }

  quickSortHelper(0, n - 1);

  const allIndices = Array.from({ length: n }, (_, k) => k);
  snapshots.push({
    structureState: {
      array: [...arr],
      sortedIndices: allIndices,
    },
    activeIndicesOrNodes: [],
    pointers: {},
    operationType: 'settled',
    codeLine: 1,
    statusNote: `Quick Sort tamamlandı! Dizi tamamen sıralandı.`,
    metrics: {
      comparisons,
      operations: comparisons + swaps,
      swaps,
      timeComplexity: 'O(n log n)',
      spaceComplexity: 'O(log n)',
    },
  });

  return snapshots;
}
