import type { StepSnapshot, VisualizerItemMetadata } from '../../engine/types';
import type { ArrayAlgorithmState } from '../sorting/bubbleSort';

export const BINARY_SEARCH_METADATA: VisualizerItemMetadata = {
  id: 'binary-search',
  name: 'Binary Search (İkili Arama)',
  shortName: 'Binary Search',
  category: 'searching',
  kind: 'algorithm',
  description:
    'Sıralı bir dizide her adımda arama aralığını yarıya indirerek logaritmik hızda hedef bulan verimli arama algoritmasıdır.',
  complexity: {
    time: {
      best: 'O(1)',
      average: 'O(log n)',
      worst: 'O(log n)',
    },
    space: 'O(1)',
  },
  pseudocode: [
    { line: 1, code: 'low = 0, high = n - 1' },
    { line: 2, code: 'while low <= high:' },
    { line: 3, code: '  mid = low + (high - low) / 2' },
    { line: 4, code: '  if arr[mid] == target: return mid' },
    { line: 5, code: '  else if arr[mid] < target: low = mid + 1' },
    { line: 6, code: '  else: high = mid - 1' },
    { line: 7, code: 'return -1 // Not Found' },
  ],
  properties: {
    sortedRequired: true,
  },
};

export function generateBinarySearchSnapshots(
  initialArray: number[],
  target: number
): StepSnapshot<ArrayAlgorithmState>[] {
  const snapshots: StepSnapshot<ArrayAlgorithmState>[] = [];
  const arr = [...initialArray].sort((a, b) => a - b); // Ensure sorted
  const n = arr.length;
  let comparisons = 0;

  if (n === 0) {
    snapshots.push({
      structureState: { array: [], sortedIndices: [] },
      activeIndicesOrNodes: [],
      pointers: { target },
      operationType: 'not-found',
      codeLine: 7,
      statusNote: 'Dizi boş, hedef bulunamadı.',
      metrics: { comparisons: 0, operations: 0, timeComplexity: 'O(1)', spaceComplexity: 'O(1)' },
    });
    return snapshots;
  }

  let low = 0;
  let high = n - 1;
  let found = false;

  while (low <= high) {
    const mid = Math.floor((low + high) / 2);
    comparisons++;
    const midVal = arr[mid];
    const isMatch = midVal === target;
    const isSmaller = midVal < target;

    // Active indices: mid is active, range [low...high] are secondary
    const rangeIndices = Array.from({ length: high - low + 1 }, (_, k) => low + k);

    snapshots.push({
      structureState: { array: [...arr], sortedIndices: [] },
      activeIndicesOrNodes: [mid],
      secondaryIndicesOrNodes: rangeIndices,
      pointers: { low, mid, high, target, 'ortanca': midVal },
      operationType: isMatch ? 'found' : 'compare',
      codeLine: isMatch ? 4 : isSmaller ? 5 : 6,
      statusNote: isMatch
        ? `Tebrikler! Hedef (${target}) ortanca indekste (arr[${mid}] = ${midVal}) bulundu!`
        : isSmaller
        ? `arr[${mid}] (${midVal}) < ${target}. Sol yarı elendi, arama sağa kayıyor (low = ${mid + 1}).`
        : `arr[${mid}] (${midVal}) > ${target}. Sağ yarı elendi, arama sola kayıyor (high = ${mid - 1}).`,
      metrics: {
        comparisons,
        operations: comparisons,
        timeComplexity: 'O(log n)',
        spaceComplexity: 'O(1)',
        customMetrics: { 'Arama Aralığı': `[${low}...${high}]` },
      },
    });

    if (isMatch) {
      found = true;
      break;
    }

    if (isSmaller) {
      low = mid + 1;
    } else {
      high = mid - 1;
    }
  }

  if (!found) {
    snapshots.push({
      structureState: { array: [...arr], sortedIndices: [] },
      activeIndicesOrNodes: [],
      pointers: { target, low, high },
      operationType: 'not-found',
      codeLine: 7,
      statusNote: `Hedef ${target} değeri dizide bulunamadı (low > high kesişti).`,
      metrics: {
        comparisons,
        operations: comparisons,
        timeComplexity: 'O(log n)',
        spaceComplexity: 'O(1)',
      },
    });
  }

  return snapshots;
}
