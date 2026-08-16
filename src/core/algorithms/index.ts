import type { IAlgorithm, ArrayAlgorithm, GraphAlgorithm } from '../../types/algorithm';
import { bubbleSort } from './sorting/bubbleSort';
import { selectionSort } from './sorting/selectionSort';
import { insertionSort } from './sorting/insertionSort';
import { mergeSort } from './sorting/mergeSort';
import { quickSort } from './sorting/quickSort';
import { linearSearch } from './searching/linearSearch';
import { binarySearch } from './searching/binarySearch';
import { jumpSearch } from './searching/jumpSearch';
import { exponentialSearch } from './searching/exponentialSearch';
import { interpolationSearch } from './searching/interpolationSearch';
import { bfs } from './graph/bfs';
import { dfs } from './graph/dfs';

export const SORTING_ALGORITHMS: Record<string, ArrayAlgorithm> = {
  'bubble-sort': bubbleSort,
  'selection-sort': selectionSort,
  'insertion-sort': insertionSort,
  'merge-sort': mergeSort,
  'quick-sort': quickSort,
};

export const SEARCHING_ALGORITHMS: Record<string, ArrayAlgorithm> = {
  'linear-search': linearSearch,
  'binary-search': binarySearch,
  'jump-search': jumpSearch,
  'exponential-search': exponentialSearch,
  'interpolation-search': interpolationSearch,
};

export const GRAPH_ALGORITHMS: Record<string, GraphAlgorithm> = {
  bfs: bfs,
  dfs: dfs,
};

export const ALL_ARRAY_ALGORITHMS: ArrayAlgorithm[] = [
  bubbleSort,
  selectionSort,
  insertionSort,
  mergeSort,
  quickSort,
  linearSearch,
  binarySearch,
  jumpSearch,
  exponentialSearch,
  interpolationSearch,
];

export const ALL_GRAPH_ALGORITHMS: GraphAlgorithm[] = [bfs, dfs];

export const ALL_ALGORITHMS: IAlgorithm[] = [...ALL_ARRAY_ALGORITHMS, ...ALL_GRAPH_ALGORITHMS];

export function getAlgorithmById(id: string): ArrayAlgorithm | undefined;
export function getAlgorithmById(id: string): IAlgorithm | undefined;
export function getAlgorithmById(id: string): IAlgorithm | undefined {
  return SORTING_ALGORITHMS[id] || SEARCHING_ALGORITHMS[id] || GRAPH_ALGORITHMS[id];
}
