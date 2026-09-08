import { describe, it, expect } from 'vitest';
import { generateBubbleSortSnapshots } from '../../algorithms/sorting/bubbleSort';
import { generateSelectionSortSnapshots } from '../../algorithms/sorting/selectionSort';
import { generateInsertionSortSnapshots } from '../../algorithms/sorting/insertionSort';
import { generateQuickSortSnapshots } from '../../algorithms/sorting/quickSort';
import { generateMergeSortSnapshots } from '../../algorithms/sorting/mergeSort';
import { generateBinarySearchSnapshots } from '../../algorithms/searching/binarySearch';
import { generateLinearSearchSnapshots } from '../../algorithms/searching/linearSearch';

describe('Algorithm Snapshot Generators', () => {
  const unsorted = [54, 26, 93, 17, 77, 31, 44, 55, 20];
  const sortedExpected = [...unsorted].sort((a, b) => a - b);

  it('Bubble Sort should produce sorted final array', () => {
    const snapshots = generateBubbleSortSnapshots(unsorted);
    const finalSnap = snapshots[snapshots.length - 1];
    expect(finalSnap.structureState.array).toEqual(sortedExpected);
    expect(finalSnap.metrics.comparisons).toBeGreaterThan(0);
  });

  it('Selection Sort should produce sorted final array', () => {
    const snapshots = generateSelectionSortSnapshots(unsorted);
    const finalSnap = snapshots[snapshots.length - 1];
    expect(finalSnap.structureState.array).toEqual(sortedExpected);
  });

  it('Insertion Sort should produce sorted final array', () => {
    const snapshots = generateInsertionSortSnapshots(unsorted);
    const finalSnap = snapshots[snapshots.length - 1];
    expect(finalSnap.structureState.array).toEqual(sortedExpected);
  });

  it('Quick Sort should produce sorted final array', () => {
    const snapshots = generateQuickSortSnapshots(unsorted);
    const finalSnap = snapshots[snapshots.length - 1];
    expect(finalSnap.structureState.array).toEqual(sortedExpected);
  });

  it('Merge Sort should produce sorted final array', () => {
    const snapshots = generateMergeSortSnapshots(unsorted);
    const finalSnap = snapshots[snapshots.length - 1];
    expect(finalSnap.structureState.array).toEqual(sortedExpected);
  });

  it('Linear Search should find target element', () => {
    const snapshots = generateLinearSearchSnapshots([10, 20, 30, 40], 30);
    const foundSnap = snapshots.find((s) => s.operationType === 'found');
    expect(foundSnap).toBeDefined();
    expect(foundSnap?.pointers?.i).toBe(2);
  });

  it('Binary Search should find target element in O(log n)', () => {
    const sorted = [10, 20, 30, 40, 50, 60, 70];
    const snapshots = generateBinarySearchSnapshots(sorted, 50);
    const foundSnap = snapshots.find((s) => s.operationType === 'found');
    expect(foundSnap).toBeDefined();
    expect(foundSnap?.pointers?.mid).toBe(4);
  });
});
