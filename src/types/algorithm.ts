export type AlgorithmCategory = 'sorting' | 'searching' | 'graph' | 'data-structure';

export interface AlgorithmComplexity {
  time: {
    best: string;
    average: string;
    worst: string;
  };
  space: string;
}

export interface AlgorithmProperties {
  stable: boolean;
  inPlace: boolean;
}

export interface AlgorithmMetadata {
  id: string;
  name: string;
  category: AlgorithmCategory;
  description: string;
  howItWorks: string[];
  realWorldApplications: string[];
  complexity: AlgorithmComplexity;
  properties: AlgorithmProperties;
  pivotSupported?: boolean;
  recursionSupported?: boolean;
}

export interface ArrayAlgorithm {
  metadata: AlgorithmMetadata;
  generateSteps(initialArray: number[], target?: number): import('./event').SimulationEvent[];
}

export interface GraphAlgorithm {
  metadata: AlgorithmMetadata;
  generateSteps(
    graph: import('./graph').GraphData,
    startNodeId: string,
    targetNodeId?: string
  ): import('./graph').GraphSimulationEvent[];
}

export type IAlgorithm = ArrayAlgorithm | GraphAlgorithm;

export function isGraphAlgorithm(algo: { metadata: AlgorithmMetadata }): algo is GraphAlgorithm {
  return algo.metadata.category === 'graph';
}

export function isArrayAlgorithm(algo: { metadata: AlgorithmMetadata }): algo is ArrayAlgorithm {
  return algo.metadata.category === 'sorting' || algo.metadata.category === 'searching';
}
