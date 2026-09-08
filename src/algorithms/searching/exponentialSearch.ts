import type { StepSnapshot, VisualizerItemMetadata } from '../../engine/types';
import type { ArrayAlgorithmState } from '../sorting/bubbleSort';

export const EXPONENTIAL_SEARCH_METADATA: VisualizerItemMetadata = {
  id: 'exponential-search',
  name: 'Exponential Search (Üstel Arama)',
  shortName: 'Exponential Search',
  category: 'searching',
  kind: 'algorithm',
  description:
    'Önce 1, 2, 4, 8 gibi 2’nin kuvvetleri şeklinde üstel sıçrayarak hedef aralığı belirleyen, ardından o aralıkta İkili Arama (Binary Search) yapan algoritmadır.',
  complexity: {
    time: {
      best: 'O(1)',
      average: 'O(log i)',
      worst: 'O(log i)',
    },
    space: 'O(1)',
  },
  pseudocode: [
    { line: 1, code: 'if arr[0] == target: return 0' },
    { line: 2, code: 'i = 1' },
    { line: 3, code: 'while i < n and arr[i] <= target: i = i * 2' },
    { line: 4, code: 'return binarySearch(arr, i / 2, min(i, n - 1), target)' },
  ],
  properties: {
    sortedRequired: true,
    speed: 'Ideal for Unbounded/Infinite Arrays',
  },
};

export function generateExponentialSearchSnapshots(
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
      codeLine: 4,
      statusNote: 'Dizi boş, hedef bulunamadı.',
      metrics: { comparisons: 0, operations: 0, timeComplexity: 'O(1)', spaceComplexity: 'O(1)' },
    });
    return snapshots;
  }

  // Check 0th element
  comparisons++;
  if (arr[0] === target) {
    snapshots.push({
      structureState: { array: [...arr], sortedIndices: [] },
      activeIndicesOrNodes: [0],
      pointers: { i: 0, target },
      operationType: 'found',
      codeLine: 1,
      statusNote: `Hedef (${target}) ilk eleman olarak (arr[0]) bulundu!`,
      metrics: { comparisons: 1, operations: 1, timeComplexity: 'O(1)', spaceComplexity: 'O(1)' },
    });
    return snapshots;
  }

  // Exponential jump phase (1, 2, 4, 8, ...)
  let i = 1;
  while (i < n && arr[i] <= target) {
    comparisons++;
    const isExact = arr[i] === target;

    snapshots.push({
      structureState: { array: [...arr], sortedIndices: [] },
      activeIndicesOrNodes: [i],
      pointers: { i, 'adım': i, target, 'değer': arr[i] },
      operationType: isExact ? 'found' : 'compare',
      codeLine: 3,
      statusNote: isExact
        ? `Tebrikler! Hedef (${target}) üstel adımda (arr[${i}] = ${arr[i]}) bulundu!`
        : `Üstel adım arr[${i}] = ${arr[i]} <= ${target}. Bir sonraki 2 katı adımına (${i * 2}) sıçranıyor...`,
      metrics: {
        comparisons,
        operations: comparisons,
        timeComplexity: 'O(log i)',
        spaceComplexity: 'O(1)',
        customMetrics: { 'Üstel İndeks': i },
      },
    });

    if (isExact) {
      return snapshots;
    }

    i = i * 2;
  }

  // Binary Search Phase within range [i/2, min(i, n - 1)]
  let low = Math.floor(i / 2);
  let high = Math.min(i, n - 1);
  let found = false;

  snapshots.push({
    structureState: { array: [...arr], sortedIndices: [] },
    activeIndicesOrNodes: [],
    secondaryIndicesOrNodes: Array.from({ length: high - low + 1 }, (_, k) => low + k),
    pointers: { low, high, target },
    operationType: 'compare',
    codeLine: 4,
    statusNote: `Hedef aralık tespit edildi: [${low}..${high}]. Bu aralıkta İkili Arama (Binary Search) başlatılıyor.`,
    metrics: {
      comparisons,
      operations: comparisons,
      timeComplexity: 'O(log i)',
      spaceComplexity: 'O(1)',
      customMetrics: { 'Arama Aralığı': `[${low}..${high}]` },
    },
  });

  while (low <= high) {
    comparisons++;
    const mid = Math.floor((low + high) / 2);
    const midVal = arr[mid];
    const isMatch = midVal === target;
    const isSmaller = midVal < target;

    const currentRangeIndices = Array.from(
      { length: high - low + 1 },
      (_, k) => low + k
    );

    snapshots.push({
      structureState: { array: [...arr], sortedIndices: [] },
      activeIndicesOrNodes: [mid],
      secondaryIndicesOrNodes: currentRangeIndices,
      pointers: { low, mid, high, target, 'ortanca': midVal },
      operationType: isMatch ? 'found' : 'compare',
      codeLine: 4,
      statusNote: isMatch
        ? `Hedef (${target}) İkili Arama aşamasında (arr[${mid}] = ${midVal}) bulundu!`
        : isSmaller
        ? `arr[${mid}] (${midVal}) < ${target}. Sol yarı elendi, sağa geçiliyor (low = ${mid + 1}).`
        : `arr[${mid}] (${midVal}) > ${target}. Sağ yarı elendi, sola geçiliyor (high = ${mid - 1}).`,
      metrics: {
        comparisons,
        operations: comparisons,
        timeComplexity: 'O(log i)',
        spaceComplexity: 'O(1)',
        customMetrics: { 'Arama Aralığı': `[${low}..${high}]` },
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
      pointers: { target },
      operationType: 'not-found',
      codeLine: 4,
      statusNote: `Hedef ${target} değeri dizide bulunamadı.`,
      metrics: {
        comparisons,
        operations: comparisons,
        timeComplexity: 'O(log i)',
        spaceComplexity: 'O(1)',
      },
    });
  }

  return snapshots;
}
