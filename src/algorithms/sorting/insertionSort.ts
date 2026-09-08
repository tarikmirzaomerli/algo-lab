import type { StepSnapshot, VisualizerItemMetadata } from '../../engine/types';
import type { ArrayAlgorithmState } from './bubbleSort';

export const INSERTION_SORT_METADATA: VisualizerItemMetadata = {
  id: 'insertion-sort',
  name: 'Insertion Sort (Araya Ekleme Sıralaması)',
  shortName: 'Insertion Sort',
  category: 'sorting',
  kind: 'algorithm',
  description:
    'Diziyi sıralı ve sırasız iki parçaya ayırarak, her adımda sırasız taraftan bir eleman alıp sıralı taraftaki doğru yerine ekleyen algoritmadır.',
  complexity: {
    time: {
      best: 'O(n)',
      average: 'O(n²)',
      worst: 'O(n²)',
    },
    space: 'O(1)',
  },
  pseudocode: [
    { line: 1, code: 'for i = 1 to n - 1:' },
    { line: 2, code: '  key = arr[i], j = i - 1' },
    { line: 3, code: '  while j >= 0 and arr[j] > key:' },
    { line: 4, code: '    arr[j + 1] = arr[j]; j = j - 1' },
    { line: 5, code: '  arr[j + 1] = key' },
  ],
  properties: {
    stable: true,
    inPlace: true,
  },
};

export function generateInsertionSortSnapshots(initialArray: number[]): StepSnapshot<ArrayAlgorithmState>[] {
  const snapshots: StepSnapshot<ArrayAlgorithmState>[] = [];
  const arr = [...initialArray];
  const n = arr.length;
  let comparisons = 0;
  let swaps = 0;
  const sortedIndices: number[] = [0];

  if (n === 0) return snapshots;

  for (let i = 1; i < n; i++) {
    const key = arr[i];
    let j = i - 1;

    snapshots.push({
      structureState: {
        array: [...arr],
        sortedIndices: [...sortedIndices],
      },
      activeIndicesOrNodes: [i],
      pointers: { i, key, j },
      operationType: 'compare',
      codeLine: 2,
      statusNote: `Hedef anahtar (key = ${key}) alındı. Sıralı kısımdaki doğru yerine kaydırılacak.`,
      metrics: {
        comparisons,
        operations: comparisons + swaps,
        swaps,
        timeComplexity: 'O(n²)',
        spaceComplexity: 'O(1)',
        customMetrics: { 'Anahtar Değer': key },
      },
    });

    while (j >= 0) {
      comparisons++;
      const shouldShift = arr[j] > key;

      snapshots.push({
        structureState: {
          array: [...arr],
          sortedIndices: [...sortedIndices],
        },
        activeIndicesOrNodes: [j, j + 1],
        pointers: { key, j, 'j+1': j + 1 },
        operationType: 'compare',
        codeLine: 3,
        statusNote: `Karşılaştırma: arr[${j}] (${arr[j]}) ${shouldShift ? '>' : '<='} key (${key}).`,
        metrics: {
          comparisons,
          operations: comparisons + swaps,
          swaps,
          timeComplexity: 'O(n²)',
          spaceComplexity: 'O(1)',
        },
      });

      if (shouldShift) {
        swaps++;
        arr[j + 1] = arr[j];

        snapshots.push({
          structureState: {
            array: [...arr],
            sortedIndices: [...sortedIndices],
          },
          activeIndicesOrNodes: [j, j + 1],
          pointers: { key, j, 'kaydırılan': j + 1 },
          operationType: 'overwrite',
          codeLine: 4,
          statusNote: `${arr[j]} > ${key} olduğundan eleman bir sağa kaydırıldı.`,
          metrics: {
            comparisons,
            operations: comparisons + swaps,
            swaps,
            timeComplexity: 'O(n²)',
            spaceComplexity: 'O(1)',
          },
        });

        j--;
      } else {
        break;
      }
    }

    arr[j + 1] = key;
    sortedIndices.push(i);

    snapshots.push({
      structureState: {
        array: [...arr],
        sortedIndices: Array.from({ length: i + 1 }, (_, k) => k),
      },
      activeIndicesOrNodes: [j + 1],
      pointers: { 'eklenen_konum': j + 1, key },
      operationType: 'settled',
      codeLine: 5,
      statusNote: `key (${key}) ${j + 1}. indekse başarıyla yerleştirildi.`,
      metrics: {
        comparisons,
        operations: comparisons + swaps,
        swaps,
        timeComplexity: 'O(n²)',
        spaceComplexity: 'O(1)',
      },
    });
  }

  return snapshots;
}
