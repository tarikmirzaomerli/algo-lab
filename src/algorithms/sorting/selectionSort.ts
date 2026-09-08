import type { StepSnapshot, VisualizerItemMetadata } from '../../engine/types';
import type { ArrayAlgorithmState } from './bubbleSort';

export const SELECTION_SORT_METADATA: VisualizerItemMetadata = {
  id: 'selection-sort',
  name: 'Selection Sort (Seçmeli Sıralama)',
  shortName: 'Selection Sort',
  category: 'sorting',
  kind: 'algorithm',
  description:
    'Her adımda dizinin sıralanmamış kısmındaki en küçük elemanı bulup o anki başa yerleştiren sıralama algoritmasıdır.',
  complexity: {
    time: {
      best: 'O(n²)',
      average: 'O(n²)',
      worst: 'O(n²)',
    },
    space: 'O(1)',
  },
  pseudocode: [
    { line: 1, code: 'for i = 0 to n - 1:' },
    { line: 2, code: '  minIdx = i' },
    { line: 3, code: '  for j = i + 1 to n:' },
    { line: 4, code: '    if arr[j] < arr[minIdx]: minIdx = j' },
    { line: 5, code: '  if minIdx != i: swap(arr[i], arr[minIdx])' },
  ],
  properties: {
    stable: false,
    inPlace: true,
  },
};

export function generateSelectionSortSnapshots(initialArray: number[]): StepSnapshot<ArrayAlgorithmState>[] {
  const snapshots: StepSnapshot<ArrayAlgorithmState>[] = [];
  const arr = [...initialArray];
  const n = arr.length;
  let comparisons = 0;
  let swaps = 0;
  const sortedIndices: number[] = [];

  if (n === 0) return snapshots;

  for (let i = 0; i < n; i++) {
    let minIdx = i;

    snapshots.push({
      structureState: {
        array: [...arr],
        sortedIndices: [...sortedIndices],
      },
      activeIndicesOrNodes: [i],
      pointers: { i, minIdx },
      operationType: 'compare',
      codeLine: 2,
      statusNote: `${i}. konum için en küçük eleman aranıyor (Başlangıç min: arr[${i}] = ${arr[i]}).`,
      metrics: {
        comparisons,
        operations: comparisons + swaps,
        swaps,
        timeComplexity: 'O(n²)',
        spaceComplexity: 'O(1)',
        customMetrics: { 'En Küçük': arr[minIdx] },
      },
    });

    for (let j = i + 1; j < n; j++) {
      comparisons++;
      const isNewMin = arr[j] < arr[minIdx];

      snapshots.push({
        structureState: {
          array: [...arr],
          sortedIndices: [...sortedIndices],
        },
        activeIndicesOrNodes: [j, minIdx],
        secondaryIndicesOrNodes: [i],
        pointers: { i, j, minIdx },
        operationType: 'compare',
        codeLine: 4,
        statusNote: `arr[${j}] (${arr[j]}) ${isNewMin ? '<' : '>='} arr[minIdx] (${arr[minIdx]}). ${isNewMin ? 'Yeni minimum bulundu!' : ''}`,
        metrics: {
          comparisons,
          operations: comparisons + swaps,
          swaps,
          timeComplexity: 'O(n²)',
          spaceComplexity: 'O(1)',
          customMetrics: { 'Mevcut Min': arr[minIdx] },
        },
      });

      if (isNewMin) {
        minIdx = j;
      }
    }

    if (minIdx !== i) {
      swaps++;
      const temp = arr[i];
      arr[i] = arr[minIdx];
      arr[minIdx] = temp;

      snapshots.push({
        structureState: {
          array: [...arr],
          sortedIndices: [...sortedIndices],
        },
        activeIndicesOrNodes: [i, minIdx],
        pointers: { i, minIdx },
        operationType: 'swap',
        codeLine: 5,
        statusNote: `En küçük eleman (${arr[i]}) ${i}. indekse taşındı (arr[${i}] ile arr[${minIdx}] takas edildi).`,
        metrics: {
          comparisons,
          operations: comparisons + swaps,
          swaps,
          timeComplexity: 'O(n²)',
          spaceComplexity: 'O(1)',
          customMetrics: { 'Takas Sayısı': swaps },
        },
      });
    }

    sortedIndices.push(i);
    snapshots.push({
      structureState: {
        array: [...arr],
        sortedIndices: [...sortedIndices],
      },
      activeIndicesOrNodes: [i],
      pointers: { 'sıralı': i },
      operationType: 'settled',
      codeLine: 5,
      statusNote: `${i}. indeks (${arr[i]}) kesin konumuna yerleşti.`,
      metrics: {
        comparisons,
        operations: comparisons + swaps,
        swaps,
        timeComplexity: 'O(n²)',
        spaceComplexity: 'O(1)',
        customMetrics: { 'Sıralı Adet': sortedIndices.length },
      },
    });
  }

  return snapshots;
}
