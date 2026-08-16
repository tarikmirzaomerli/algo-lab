import type { GraphData } from '../../types/graph';

/**
 * BFS ve DFS görselleştirmeleri için varsayılan 6 düğümlü örnek Graf preset'i
 */
export const DEFAULT_GRAPH_PRESET: GraphData = {
  nodes: [
    { id: 'A', label: 'A', x: 400, y: 70 },
    { id: 'B', label: 'B', x: 220, y: 190 },
    { id: 'C', label: 'C', x: 580, y: 190 },
    { id: 'D', label: 'D', x: 140, y: 340 },
    { id: 'E', label: 'E', x: 340, y: 340 },
    { id: 'F', label: 'F', x: 660, y: 340 },
  ],
  edges: [
    { id: 'e-A-B', source: 'A', target: 'B' },
    { id: 'e-A-C', source: 'A', target: 'C' },
    { id: 'e-B-D', source: 'B', target: 'D' },
    { id: 'e-B-E', source: 'B', target: 'E' },
    { id: 'e-C-F', source: 'C', target: 'F' },
    { id: 'e-E-F', source: 'E', target: 'F' },
  ],
  isDirected: false,
};
