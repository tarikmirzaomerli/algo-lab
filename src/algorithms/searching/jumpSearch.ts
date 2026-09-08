import type { StepSnapshot, VisualizerItemMetadata } from '../../engine/types';
import type { ArrayAlgorithmState } from '../sorting/bubbleSort';

export const JUMP_SEARCH_METADATA: VisualizerItemMetadata = {
  id: 'jump-search',
  name: 'Jump Search (Sıçrama Araması)',
  shortName: 'Jump Search',
  category: 'searching',
  kind: 'algorithm',
  description:
    'Sıralı dizilerde sabit blok adımlarıyla (√n) ileri sıçrayarak hedef bloğu belirleyen ve blok içinde doğrusal arama yapan algoritmadır.',
  complexity: {
    time: {
      best: 'O(1)',
      average: 'O(√n)',
      worst: 'O(√n)',
    },
    space: 'O(1)',
  },
  pseudocode: [
    { line: 1, code: 'step = floor(sqrt(n)), prev = 0' },
    { line: 2, code: 'while arr[min(step, n) - 1] < target:' },
    { line: 3, code: '  prev = step; step += floor(sqrt(n))' },
    { line: 4, code: '  if prev >= n: return -1 // Not Found' },
    { line: 5, code: 'while arr[prev] < target:' },
    { line: 6, code: '  prev++; if prev == min(step, n): return -1' },
    { line: 7, code: 'if arr[prev] == target: return prev' },
  ],
  properties: {
    sortedRequired: true,
    blockSize: '√n',
  },
};

export function generateJumpSearchSnapshots(
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
      statusNote: 'Dizi boş, hedef değer bulunamadı.',
      metrics: { comparisons: 0, operations: 0, timeComplexity: 'O(1)', spaceComplexity: 'O(1)' },
    });
    return snapshots;
  }

  const blockSize = Math.max(1, Math.floor(Math.sqrt(n)));
  let prev = 0;
  let step = blockSize;

  // Jump phase
  while (prev < n) {
    const checkIdx = Math.min(step, n) - 1;
    comparisons++;
    const checkVal = arr[checkIdx];

    const currentBlockIndices = Array.from(
      { length: Math.min(step, n) - prev },
      (_, k) => prev + k
    );

    snapshots.push({
      structureState: { array: [...arr], sortedIndices: [] },
      activeIndicesOrNodes: [checkIdx],
      secondaryIndicesOrNodes: currentBlockIndices,
      pointers: { prev, step: checkIdx, 'blok_sonu': checkVal, target },
      operationType: 'compare',
      codeLine: 2,
      statusNote: `Blok sonu inceleniyor: arr[${checkIdx}] (${checkVal}) < ${target} ? (${checkVal < target ? 'Evet, sıçra' : 'Hayır, hedef blok bulundu!'})`,
      metrics: {
        comparisons,
        operations: comparisons,
        timeComplexity: 'O(√n)',
        spaceComplexity: 'O(1)',
        customMetrics: { 'Blok Boyutu': blockSize, 'Mevcut Blok': `[${prev}..${checkIdx}]` },
      },
    });

    if (checkVal >= target) {
      break; // Found block
    }

    prev = step;
    step += blockSize;

    if (prev >= n) {
      snapshots.push({
        structureState: { array: [...arr], sortedIndices: [] },
        activeIndicesOrNodes: [],
        pointers: { target },
        operationType: 'not-found',
        codeLine: 4,
        statusNote: `Dizi aşıldı, hedef (${target}) bulunamadı.`,
        metrics: {
          comparisons,
          operations: comparisons,
          timeComplexity: 'O(√n)',
          spaceComplexity: 'O(1)',
        },
      });
      return snapshots;
    }
  }

  // Linear search inside block
  const blockLimit = Math.min(step, n);
  let found = false;

  while (prev < blockLimit) {
    comparisons++;
    const currentVal = arr[prev];
    const isMatch = currentVal === target;

    snapshots.push({
      structureState: { array: [...arr], sortedIndices: [] },
      activeIndicesOrNodes: [prev],
      secondaryIndicesOrNodes: Array.from({ length: blockLimit - prev }, (_, k) => prev + k),
      pointers: { prev, 'mevcut': currentVal, target },
      operationType: isMatch ? 'found' : 'compare',
      codeLine: isMatch ? 7 : 5,
      statusNote: isMatch
        ? `Tebrikler! Hedef (${target}) ${prev}. indekste bulundu!`
        : `Doğrusal tarama: arr[${prev}] (${currentVal}) < ${target}. Sonraki elemana geçiliyor...`,
      metrics: {
        comparisons,
        operations: comparisons,
        timeComplexity: 'O(√n)',
        spaceComplexity: 'O(1)',
        customMetrics: { 'Blok İçi Konum': `${prev} / ${blockLimit - 1}` },
      },
    });

    if (isMatch) {
      found = true;
      break;
    }

    if (currentVal > target) {
      break;
    }

    prev++;
  }

  if (!found) {
    snapshots.push({
      structureState: { array: [...arr], sortedIndices: [] },
      activeIndicesOrNodes: [],
      pointers: { target },
      operationType: 'not-found',
      codeLine: 6,
      statusNote: `Hedef ${target} değeri tespit edilen blok içinde bulunamadı.`,
      metrics: {
        comparisons,
        operations: comparisons,
        timeComplexity: 'O(√n)',
        spaceComplexity: 'O(1)',
      },
    });
  }

  return snapshots;
}
