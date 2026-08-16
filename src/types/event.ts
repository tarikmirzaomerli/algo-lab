export type StepEventType =
  | 'COMPARE'
  | 'SWAP'
  | 'OVERWRITE'
  | 'MARK_SORTED'
  | 'SELECT_MIN'
  | 'INSERT'
  | 'SPLIT'
  | 'MERGE'
  | 'PIVOT_SELECT'
  | 'PARTITION_COMPLETE'
  | 'PASS_COMPLETE'
  | 'COMPLETE';

export interface StepStats {
  comparisons: number;
  swaps: number;
  pass: number;
}

export type StepMeta =
  | {
      kind: 'linear-search';
    }
  | {
      kind: 'binary-search';
      low: number;
      mid: number;
      high: number;
    }
  | {
      kind: 'jump-search';
      blockSize: number;
      blockStart: number;
      blockEnd: number;
      phase: 'jump' | 'linear';
    }
  | {
      kind: 'exponential-search';
      boundIndex: number;
      previousBound: number;
      phase: 'BOUND' | 'BINARY';
      low?: number;
      mid?: number;
      high?: number;
    }
  | {
      kind: 'interpolation-search';
      low: number;
      high: number;
      probe: number;
      phase?: 'interpolate';
    }
  | {
      kind: 'selection-sort';
      isMinCandidate?: boolean;
    }
  | {
      kind: 'insertion-sort';
      isKeySelected?: boolean;
      isShift?: boolean;
    }
  | {
      kind: 'bfs';
      queue: string[];
      currentNode?: string;
    }
  | {
      kind: 'dfs';
      stack: string[];
      currentNode?: string;
    };

/**
 * Adımın bir Arama (Search) algoritmasına ait olup olmadığını kontrol eden Tip Muhafızı (Type Guard)
 */
export function isSearchMeta(meta?: StepMeta): boolean {
  if (!meta) return false;
  return (
    meta.kind === 'linear-search' ||
    meta.kind === 'binary-search' ||
    meta.kind === 'jump-search' ||
    meta.kind === 'exponential-search' ||
    meta.kind === 'interpolation-search'
  );
}

/**
 * Adımın bir Çizge (Graph) algoritmasına ait olup olmadığını kontrol eden Tip Muhafızı (Type Guard)
 */
export function isGraphMeta(meta?: StepMeta): boolean {
  if (!meta) return false;
  return meta.kind === 'bfs' || meta.kind === 'dfs';
}

/**
 * Ham Algoritma Simülasyon Olayı (Raw Simulation Event)
 * Algoritma çekirdeği tarafından üretilir. Metin veya dil verisi içermez.
 */
export interface SimulationEvent {
  stepIndex: number;
  totalSteps: number;
  type: StepEventType;
  indices: number[];
  values: number[];
  arraySnapshot: number[];
  sortedIndices: number[];
  pivotIndex?: number;
  subArrayRange?: [number, number];
  stats: StepStats;
  recursionFrame?: string;
  meta?: StepMeta;
}

/**
 * Anlatım Motoru (Explanation Engine) Çıktısı
 */
export interface StepExplanation {
  title: string;
  description: string;
  formula?: string;
}

/**
 * UI Katmanının tükettiği birleşik Adım verisi
 */
export interface AlgorithmStep extends SimulationEvent, StepExplanation {}
