import type { StepSnapshot, VisualizerItemMetadata } from '../../engine/types';
import type { ArrayAlgorithmState } from '../sorting/bubbleSort';

export const INTERPOLATION_SEARCH_METADATA: VisualizerItemMetadata = {
  id: 'interpolation-search',
  name: 'Interpolation Search (Enterpolasyon Araması)',
  shortName: 'Interpolation Search',
  category: 'searching',
  kind: 'algorithm',
  description:
    'Düzgün dağılımlı sıralı dizilerde hedefin tahmini konumunu matematiksel formülle hesaplayarak O(log log n) hızında arama yapan algoritmadır.',
  complexity: {
    time: {
      best: 'O(1)',
      average: 'O(log log n)',
      worst: 'O(n)',
    },
    space: 'O(1)',
  },
  pseudocode: [
    { line: 1, code: 'low = 0, high = n - 1' },
    { line: 2, code: 'while low <= high and target in [arr[low], arr[high]]:' },
    { line: 3, code: '  pos = low + ((target - arr[low]) * (high - low)) / (arr[high] - arr[low])' },
    { line: 4, code: '  if arr[pos] == target: return pos' },
    { line: 5, code: '  else if arr[pos] < target: low = pos + 1' },
    { line: 6, code: '  else: high = pos - 1' },
    { line: 7, code: 'return -1 // Not Found' },
  ],
  properties: {
    sortedRequired: true,
    distribution: 'Uniform Distribution Recommended',
  },
};

export function generateInterpolationSearchSnapshots(
  initialArray: number[],
  target: number
): StepSnapshot<ArrayAlgorithmState>[] {
  const snapshots: StepSnapshot<ArrayAlgorithmState>[] = [];
  const arr = [...initialArray].sort((a, b) => a - b);
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

  while (low <= high && target >= arr[low] && target <= arr[high]) {
    comparisons++;

    if (arr[high] === arr[low]) {
      if (arr[low] === target) {
        snapshots.push({
          structureState: { array: [...arr], sortedIndices: [] },
          activeIndicesOrNodes: [low],
          pointers: { low, high, target },
          operationType: 'found',
          codeLine: 4,
          statusNote: `Tüm elemanlar eşit, hedef (${target}) ${low}. indekste bulundu!`,
          metrics: { comparisons, operations: comparisons, timeComplexity: 'O(1)', spaceComplexity: 'O(1)' },
        });
        found = true;
      }
      break;
    }

    // Formula calculation
    const pos =
      low +
      Math.floor(((target - arr[low]) * (high - low)) / (arr[high] - arr[low]));

    if (pos < low || pos > high) break;

    const posVal = arr[pos];
    const isMatch = posVal === target;
    const isSmaller = posVal < target;

    const searchRangeIndices = Array.from(
      { length: high - low + 1 },
      (_, k) => low + k
    );

    snapshots.push({
      structureState: { array: [...arr], sortedIndices: [] },
      activeIndicesOrNodes: [pos],
      secondaryIndicesOrNodes: searchRangeIndices,
      pointers: { low, pos, high, target, 'tahmin_değer': posVal },
      operationType: isMatch ? 'found' : 'compare',
      codeLine: isMatch ? 4 : isSmaller ? 5 : 6,
      statusNote: isMatch
        ? `Tebrikler! Enterpolasyon formülü hedefi (${target}) tam ${pos}. indekste buldu!`
        : isSmaller
        ? `arr[${pos}] (${posVal}) < ${target}. Arama aralığı sağa kaydırılıyor (low = ${pos + 1}).`
        : `arr[${pos}] (${posVal}) > ${target}. Arama aralığı sola kaydırılıyor (high = ${pos - 1}).`,
      metrics: {
        comparisons,
        operations: comparisons,
        timeComplexity: 'O(log log n)',
        spaceComplexity: 'O(1)',
        customMetrics: { 'Tahmini İndeks': pos, 'Aralık': `[${low}..${high}]` },
      },
    });

    if (isMatch) {
      found = true;
      break;
    }

    if (isSmaller) {
      low = pos + 1;
    } else {
      high = pos - 1;
    }
  }

  if (!found) {
    snapshots.push({
      structureState: { array: [...arr], sortedIndices: [] },
      activeIndicesOrNodes: [],
      pointers: { target, low, high },
      operationType: 'not-found',
      codeLine: 7,
      statusNote: `Hedef ${target} değeri enterpolasyon aralığında bulunamadı.`,
      metrics: {
        comparisons,
        operations: comparisons,
        timeComplexity: 'O(log log n)',
        spaceComplexity: 'O(1)',
      },
    });
  }

  return snapshots;
}
