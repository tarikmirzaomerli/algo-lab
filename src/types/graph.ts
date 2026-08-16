import type { StepMeta, StepExplanation } from './event';

/**
 * Graf Düğüm (Node / Vertex) Temsili
 */
export interface GraphNode {
  id: string;
  label: string;
  x: number; // 2D SVG canvas X koordinatı (0 - 100 bağıntılı veya px)
  y: number; // 2D SVG canvas Y koordinatı (0 - 100 bağıntılı veya px)
}

/**
 * Graf Kenar (Edge) Temsili
 */
export interface GraphEdge {
  id: string;
  source: string;
  target: string;
  weight?: number;
}

/**
 * Graf Veri Modeli
 */
export interface GraphData {
  nodes: GraphNode[];
  edges: GraphEdge[];
  isDirected?: boolean;
}

/**
 * Graf Algoritmaları Olay Türleri
 */
export type GraphEventType =
  | 'VISIT_NODE'
  | 'ENQUEUE'
  | 'DEQUEUE'
  | 'PUSH'
  | 'POP'
  | 'TRAVERSE_EDGE'
  | 'BACKTRACK'
  | 'COMPLETE';

/**
 * Graf Algoritması İstatistikleri
 */
export interface GraphStepStats {
  visitedCount: number;
  traversedEdgesCount: number;
  maxFrontierSize: number;
}

/**
 * Ham Graf Simülasyon Olayı (Graph Simulation Event)
 */
export interface GraphSimulationEvent {
  stepIndex: number;
  totalSteps: number;
  type: GraphEventType;
  currentNodeId?: string;
  visitedNodeIds: string[];
  frontierNodeIds: string[]; // BFS için Queue, DFS için Stack eleman ID'leri
  activeEdgeId?: string;
  targetNodeId?: string;
  stats: GraphStepStats;
  meta?: StepMeta;
}

/**
 * UI Katmanının tükettiği zenginleştirilmiş Graf Adım verisi
 */
export interface GraphAlgorithmStep extends GraphSimulationEvent, StepExplanation {}

/**
 * Tüm Algoritma Adımları Birlik Tipi (Array veya Graph Adımı)
 */
export type AnyAlgorithmStep = import('./event').AlgorithmStep | GraphAlgorithmStep;
