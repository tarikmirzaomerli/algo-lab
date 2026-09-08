export type OperationType =
  | 'idle'
  | 'compare'
  | 'swap'
  | 'push'
  | 'pop'
  | 'peek'
  | 'enqueue'
  | 'dequeue'
  | 'insert'
  | 'delete'
  | 'traverse'
  | 'visit'
  | 'settled'
  | 'found'
  | 'not-found'
  | 'rebalance'
  | 'reverse'
  | 'overwrite';

export interface VisualizerMetrics {
  comparisons: number;
  operations: number;
  swaps?: number;
  timeComplexity: string;
  spaceComplexity: string;
  customMetrics?: Record<string, string | number>;
}

export type PointerMap = Record<string, string | number>;

export interface StepSnapshot<T = unknown> {
  structureState: T;
  activeIndicesOrNodes: (string | number)[];
  secondaryIndicesOrNodes?: (string | number)[];
  pointers?: PointerMap;
  operationType: OperationType;
  codeLine: number; // 1-based index in pseudocode
  statusNote: string; // 1 concise micro-narrative sentence
  metrics: VisualizerMetrics;
}

export interface PseudocodeLine {
  line: number;
  code: string;
  indent?: number;
}

export type ItemCategory = 'linear' | 'tree' | 'sorting' | 'searching' | 'graph';

export interface ComplexityInfo {
  time: {
    best: string;
    average: string;
    worst: string;
  };
  space: string;
}

export interface VisualizerItemMetadata {
  id: string;
  name: string;
  shortName: string;
  category: ItemCategory;
  kind: 'structure' | 'algorithm';
  description: string;
  complexity: ComplexityInfo;
  pseudocode: PseudocodeLine[];
  properties?: Record<string, string | boolean | number>;
}
