import type { StepSnapshot, VisualizerItemMetadata } from '../../engine/types';
import type { ArrayAlgorithmState } from './bubbleSort';

export const MERGE_SORT_METADATA: VisualizerItemMetadata = {
  id: 'merge-sort',
  name: 'Merge Sort (Birleştirmeli Sıralama)',
  shortName: 'Merge Sort',
  category: 'sorting',
  kind: 'algorithm',
  description:
    'Diziyi sürekli iki eşit yarıya bölüp, her parçayı sıralayarak birleştiren (Merge) kararlı (stable) algoritmadır.',
  complexity: {
    time: {
      best: 'O(n log n)',
      average: 'O(n log n)',
      worst: 'O(n log n)',
    },
    space: 'O(n)',
  },
  pseudocode: [
    { line: 1, code: 'function mergeSort(arr, l, r):' },
    { line: 2, code: '  if l >= r: return' },
    { line: 3, code: '  m = l + (r - l) / 2' },
    { line: 4, code: '  mergeSort(l, m); mergeSort(m+1, r)' },
    { line: 5, code: '  merge(arr, l, m, r)' },
  ],
  properties: {
    stable: true,
    inPlace: false,
  },
};

export function generateMergeSortSnapshots(initialArray: number[]): StepSnapshot<ArrayAlgorithmState>[] {
  const snapshots: StepSnapshot<ArrayAlgorithmState>[] = [];
  const arr = [...initialArray];
  const n = arr.length;
  let comparisons = 0;
  let operations = 0;
  const sortedIndices: number[] = [];

  if (n === 0) return snapshots;

  function merge(left: number, mid: number, right: number) {
    const leftArr = arr.slice(left, mid + 1);
    const rightArr = arr.slice(mid + 1, right + 1);

    let i = 0;
    let j = 0;
    let k = left;

    snapshots.push({
      structureState: {
        array: [...arr],
        sortedIndices: [...sortedIndices],
      },
      activeIndicesOrNodes: Array.from({ length: right - left + 1 }, (_, idx) => left + idx),
      pointers: { left, mid, right },
      operationType: 'compare',
      codeLine: 5,
      statusNote: `Birleştirme: [${left}...${mid}] ve [${mid + 1}...${right}] aralıkları sıralı şekilde birleştiriliyor.`,
      metrics: {
        comparisons,
        operations,
        timeComplexity: 'O(n log n)',
        spaceComplexity: 'O(n)',
        customMetrics: { 'Aralık': `${left}-${right}` },
      },
    });

    while (i < leftArr.length && j < rightArr.length) {
      comparisons++;
      operations++;
      if (leftArr[i] <= rightArr[j]) {
        arr[k] = leftArr[i];
        i++;
      } else {
        arr[k] = rightArr[j];
        j++;
      }

      snapshots.push({
        structureState: {
          array: [...arr],
          sortedIndices: [...sortedIndices],
        },
        activeIndicesOrNodes: [k],
        pointers: { k, left, right },
        operationType: 'overwrite',
        codeLine: 5,
        statusNote: `arr[${k}] = ${arr[k]} birleşik diziye yazıldı.`,
        metrics: {
          comparisons,
          operations,
          timeComplexity: 'O(n log n)',
          spaceComplexity: 'O(n)',
        },
      });

      k++;
    }

    while (i < leftArr.length) {
      operations++;
      arr[k] = leftArr[i];
      snapshots.push({
        structureState: {
          array: [...arr],
          sortedIndices: [...sortedIndices],
        },
        activeIndicesOrNodes: [k],
        pointers: { k },
        operationType: 'overwrite',
        codeLine: 5,
        statusNote: `Kalan sol eleman arr[${k}] = ${arr[k]} aktarıldı.`,
        metrics: { comparisons, operations, timeComplexity: 'O(n log n)', spaceComplexity: 'O(n)' },
      });
      i++;
      k++;
    }

    while (j < rightArr.length) {
      operations++;
      arr[k] = rightArr[j];
      snapshots.push({
        structureState: {
          array: [...arr],
          sortedIndices: [...sortedIndices],
        },
        activeIndicesOrNodes: [k],
        pointers: { k },
        operationType: 'overwrite',
        codeLine: 5,
        statusNote: `Kalan sağ eleman arr[${k}] = ${arr[k]} aktarıldı.`,
        metrics: { comparisons, operations, timeComplexity: 'O(n log n)', spaceComplexity: 'O(n)' },
      });
      j++;
      k++;
    }

    if (left === 0 && right === n - 1) {
      for (let idx = 0; idx < n; idx++) sortedIndices.push(idx);
    }
  }

  function mergeSortHelper(left: number, right: number) {
    if (left < right) {
      const mid = Math.floor((left + right) / 2);
      mergeSortHelper(left, mid);
      mergeSortHelper(mid + 1, right);
      merge(left, mid, right);
    }
  }

  mergeSortHelper(0, n - 1);

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
    statusNote: `Merge Sort tamamlandı! Dizi kararlı bir şekilde sıralandı.`,
    metrics: {
      comparisons,
      operations,
      timeComplexity: 'O(n log n)',
      spaceComplexity: 'O(n)',
    },
  });

  return snapshots;
}
