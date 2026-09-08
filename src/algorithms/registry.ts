import type { VisualizerItemMetadata } from '../engine/types';
import { STACK_METADATA } from '../structures/stack/stackEngine';
import { QUEUE_METADATA } from '../structures/queue/queueEngine';
import { LINKED_LIST_METADATA } from '../structures/linkedList/linkedListEngine';
import { BST_METADATA } from '../structures/bst/bstEngine';
import { BUBBLE_SORT_METADATA } from './sorting/bubbleSort';
import { SELECTION_SORT_METADATA } from './sorting/selectionSort';
import { INSERTION_SORT_METADATA } from './sorting/insertionSort';
import { QUICK_SORT_METADATA } from './sorting/quickSort';
import { MERGE_SORT_METADATA } from './sorting/mergeSort';
import { LINEAR_SEARCH_METADATA } from './searching/linearSearch';
import { BINARY_SEARCH_METADATA } from './searching/binarySearch';

export const ALL_VISUALIZER_ITEMS: Record<string, VisualizerItemMetadata> = {
  // Linear Data Structures
  stack: STACK_METADATA,
  queue: QUEUE_METADATA,
  'linked-list': LINKED_LIST_METADATA,

  // Tree Data Structures
  bst: BST_METADATA,

  // Sorting
  'bubble-sort': BUBBLE_SORT_METADATA,
  'selection-sort': SELECTION_SORT_METADATA,
  'insertion-sort': INSERTION_SORT_METADATA,
  'quick-sort': QUICK_SORT_METADATA,
  'merge-sort': MERGE_SORT_METADATA,

  // Searching
  'linear-search': LINEAR_SEARCH_METADATA,
  'binary-search': BINARY_SEARCH_METADATA,
};

export interface CategoryGroup {
  id: string;
  name: string;
  icon: string;
  itemIds: string[];
}

export const CATEGORY_GROUPS: CategoryGroup[] = [
  {
    id: 'linear',
    name: 'Doğrusal Yapılar',
    icon: 'Layers',
    itemIds: ['stack', 'queue', 'linked-list'],
  },
  {
    id: 'tree',
    name: 'Ağaç Yapıları',
    icon: 'GitFork',
    itemIds: ['bst'],
  },
  {
    id: 'sorting',
    name: 'Sıralama Algoritmaları',
    icon: 'ArrowDownUp',
    itemIds: ['bubble-sort', 'selection-sort', 'insertion-sort', 'quick-sort', 'merge-sort'],
  },
  {
    id: 'searching',
    name: 'Arama Algoritmaları',
    icon: 'Search',
    itemIds: ['linear-search', 'binary-search'],
  },
];

export function getItemMetadata(id: string): VisualizerItemMetadata {
  return ALL_VISUALIZER_ITEMS[id] || ALL_VISUALIZER_ITEMS['bubble-sort'];
}
