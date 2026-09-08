import type { StepSnapshot, VisualizerItemMetadata } from '../../engine/types';

export interface ArrayAlgorithmState {
  array: number[];
  sortedIndices: number[];
}

export const BUBBLE_SORT_METADATA: VisualizerItemMetadata = {
  id: 'bubble-sort',
  name: 'Bubble Sort (Baloncuk Sıralaması)',
  shortName: 'Bubble Sort',
  category: 'sorting',
  kind: 'algorithm',
  description:
    'Yan yana duran elemanları sürekli karşılaştırarak büyük olanları dizinin sonuna doğru kaydıran sezgisel sıralama algoritmasıdır.',
  complexity: {
    time: {
      best: 'O(n)',
      average: 'O(n²)',
      worst: 'O(n²)',
    },
    space: 'O(1)',
  },
  pseudocode: [
    { line: 1, code: 'for i = 0 to n - 1:' },
    { line: 2, code: '  for j = 0 to n - i - 1:' },
    { line: 3, code: '    if arr[j] > arr[j + 1]:' },
    { line: 4, code: '      swap(arr[j], arr[j + 1])' },
    { line: 5, code: '  mark arr[n - 1 - i] sorted' },
  ],
  properties: {
    stable: true,
    inPlace: true,
  },
};

export function generateBubbleSortSnapshots(initialArray: number[]): StepSnapshot<ArrayAlgorithmState>[] {
  const snapshots: StepSnapshot<ArrayAlgorithmState>[] = [];
  const arr = [...initialArray];
  const n = arr.length;
  let comparisons = 0;
  let swaps = 0;
  const sortedIndices: number[] = [];

  if (n === 0) return snapshots;

  for (let i = 0; i < n - 1; i++) {
    let swappedInPass = false;

    for (let j = 0; j < n - 1 - i; j++) {
      comparisons++;
      const valA = arr[j];
      const valB = arr[j + 1];

      // Compare step
      snapshots.push({
        structureState: {
          array: [...arr],
          sortedIndices: [...sortedIndices],
        },
        activeIndicesOrNodes: [j, j + 1],
        pointers: { i, j, 'j+1': j + 1 },
        operationType: 'compare',
        codeLine: 3,
        statusNote: `Karşılaştırma: arr[${j}] (${valA}) ${valA > valB ? '>' : '<='} arr[${j + 1}] (${valB}).`,
        metrics: {
          comparisons,
          operations: comparisons + swaps,
          swaps,
          timeComplexity: 'O(n²)',
          spaceComplexity: 'O(1)',
          customMetrics: { 'Tur (Pass)': i + 1 },
        },
      });

      if (valA > valB) {
        swaps++;
        swappedInPass = true;
        arr[j] = valB;
        arr[j + 1] = valA;

        // Swap step
        snapshots.push({
          structureState: {
            array: [...arr],
            sortedIndices: [...sortedIndices],
          },
          activeIndicesOrNodes: [j, j + 1],
          pointers: { i, j, 'j+1': j + 1 },
          operationType: 'swap',
          codeLine: 4,
          statusNote: `${valA} > ${valB} olduğu için arr[${j}] ve arr[${j + 1}] yer değiştirildi.`,
          metrics: {
            comparisons,
            operations: comparisons + swaps,
            swaps,
            timeComplexity: 'O(n²)',
            spaceComplexity: 'O(1)',
            customMetrics: { 'Tur (Pass)': i + 1 },
          },
        });
      }
    }

    const settledIdx = n - 1 - i;
    sortedIndices.push(settledIdx);

    snapshots.push({
      structureState: {
        array: [...arr],
        sortedIndices: [...sortedIndices],
      },
      activeIndicesOrNodes: [settledIdx],
      pointers: { i, 'en_büyük': settledIdx },
      operationType: 'settled',
      codeLine: 5,
      statusNote: `${i + 1}. turun en büyük elemanı (${arr[settledIdx]}) doğru konumuna yerleşti.`,
      metrics: {
        comparisons,
        operations: comparisons + swaps,
        swaps,
        timeComplexity: 'O(n²)',
        spaceComplexity: 'O(1)',
        customMetrics: { 'Sıralı Eleman': sortedIndices.length },
      },
    });

    if (!swappedInPass) {
      break;
    }
  }

  const allIndices = Array.from({ length: n }, (_, k) => k);
  snapshots.push({
    structureState: {
      array: [...arr],
      sortedIndices: allIndices,
    },
    activeIndicesOrNodes: [],
    pointers: {},
    operationType: 'settled',
    codeLine: 5,
    statusNote: `Tebrikler! Dizi Bubble Sort ile tamamen sıralandı. (${comparisons} karşılaştırma, ${swaps} takas)`,
    metrics: {
      comparisons,
      operations: comparisons + swaps,
      swaps,
      timeComplexity: 'O(n²)',
      spaceComplexity: 'O(1)',
      customMetrics: { 'Toplam Takas': swaps },
    },
  });

  return snapshots;
}
