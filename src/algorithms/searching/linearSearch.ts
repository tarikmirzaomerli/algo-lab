import type { StepSnapshot, VisualizerItemMetadata } from '../../engine/types';
import type { ArrayAlgorithmState } from '../sorting/bubbleSort';

export const LINEAR_SEARCH_METADATA: VisualizerItemMetadata = {
  id: 'linear-search',
  name: 'Linear Search (Doğrusal Arama)',
  shortName: 'Linear Search',
  category: 'searching',
  kind: 'algorithm',
  description:
    'Dizinin başından başlayarak her elemanı aranan hedef değerle sırayla karşılaştıran en temel arama yöntemidir.',
  complexity: {
    time: {
      best: 'O(1)',
      average: 'O(n)',
      worst: 'O(n)',
    },
    space: 'O(1)',
  },
  pseudocode: [
    { line: 1, code: 'function linearSearch(arr, target):' },
    { line: 2, code: '  for i = 0 to n - 1:' },
    { line: 3, code: '    if arr[i] == target:' },
    { line: 4, code: '      return i // Found' },
    { line: 5, code: '  return -1 // Not Found' },
  ],
  properties: {
    sortedRequired: false,
  },
};

export function generateLinearSearchSnapshots(
  initialArray: number[],
  target: number
): StepSnapshot<ArrayAlgorithmState>[] {
  const snapshots: StepSnapshot<ArrayAlgorithmState>[] = [];
  const arr = [...initialArray];
  const n = arr.length;
  let comparisons = 0;

  if (n === 0) {
    snapshots.push({
      structureState: { array: [], sortedIndices: [] },
      activeIndicesOrNodes: [],
      pointers: { target },
      operationType: 'not-found',
      codeLine: 5,
      statusNote: 'Dizi boş, hedef değer bulunamadı.',
      metrics: { comparisons: 0, operations: 0, timeComplexity: 'O(1)', spaceComplexity: 'O(1)' },
    });
    return snapshots;
  }

  let found = false;

  for (let i = 0; i < n; i++) {
    comparisons++;
    const isMatch = arr[i] === target;

    snapshots.push({
      structureState: { array: [...arr], sortedIndices: [] },
      activeIndicesOrNodes: [i],
      pointers: { i, target, 'aranan': target },
      operationType: isMatch ? 'found' : 'compare',
      codeLine: isMatch ? 4 : 3,
      statusNote: isMatch
        ? `Hedef ${target} değeri arr[${i}] konumunda başarıyla bulundu!`
        : `arr[${i}] (${arr[i]}) != ${target}. Bir sonraki elemana geçiliyor...`,
      metrics: {
        comparisons,
        operations: comparisons,
        timeComplexity: 'O(n)',
        spaceComplexity: 'O(1)',
        customMetrics: { 'İncelenen İndeks': i },
      },
    });

    if (isMatch) {
      found = true;
      break;
    }
  }

  if (!found) {
    snapshots.push({
      structureState: { array: [...arr], sortedIndices: [] },
      activeIndicesOrNodes: [],
      pointers: { target },
      operationType: 'not-found',
      codeLine: 5,
      statusNote: `Hedef ${target} değeri dizide bulunamadı (Dizinin sonuna ulaşıldı).`,
      metrics: {
        comparisons,
        operations: comparisons,
        timeComplexity: 'O(n)',
        spaceComplexity: 'O(1)',
      },
    });
  }

  return snapshots;
}
