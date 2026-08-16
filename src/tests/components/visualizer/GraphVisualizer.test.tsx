import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { GraphVisualizer } from '../../../components/visualizer/GraphVisualizer';
import type { GraphData, GraphAlgorithmStep } from '../../../types/graph';
import { DEFAULT_GRAPH_PRESET } from '../../../core/constants/defaultGraph';

describe('GraphVisualizer UI Component Unit & Visual State Mapping Tests', () => {
  const sampleGraph: GraphData = {
    nodes: [
      { id: 'A', label: 'A', x: 100, y: 100 },
      { id: 'B', label: 'B', x: 200, y: 200 },
      { id: 'C', label: 'C', x: 300, y: 300 },
    ],
    edges: [
      { id: 'e-A-B', source: 'A', target: 'B' },
      { id: 'e-B-C', source: 'B', target: 'C' },
    ],
    isDirected: false,
  };

  const createMockGraphStep = (
    override: Partial<GraphAlgorithmStep> = {}
  ): GraphAlgorithmStep => ({
    stepIndex: 1,
    totalSteps: 5,
    type: 'VISIT_NODE',
    currentNodeId: 'A',
    visitedNodeIds: ['A'],
    frontierNodeIds: ['B'],
    stats: { visitedCount: 1, traversedEdgesCount: 0, maxFrontierSize: 1 },
    title: 'Düğüm A Ziyaret Ediliyor',
    description: 'Adım Açıklaması',
    meta: { kind: 'bfs', queue: ['B'], currentNode: 'A' },
    ...override,
  });

  describe('1. Default & Preset Render Tests', () => {
    it('step = undefined olduğunda varsayılan preset düğüm ve kenarları çökmeden render etmeli', () => {
      const { container } = render(<GraphVisualizer step={undefined} />);

      const nodes = container.querySelectorAll('.graph-node');
      expect(nodes.length).toBe(DEFAULT_GRAPH_PRESET.nodes.length);

      const edges = container.querySelectorAll('.graph-edge');
      expect(edges.length).toBe(DEFAULT_GRAPH_PRESET.edges.length);
    });

    it('Özel GraphData verildiğinde doğru sayıda düğüm ve kenar render etmeli', () => {
      const { container } = render(
        <GraphVisualizer step={undefined} initialGraph={sampleGraph} />
      );

      const nodes = container.querySelectorAll('.graph-node');
      expect(nodes.length).toBe(3);

      const edges = container.querySelectorAll('.graph-edge');
      expect(edges.length).toBe(2);
    });
  });

  describe('2. Node State Class & Badge Mapping Tests', () => {
    it('Aktif (currentNodeId) düğüm node-current sınıfı ve AKTİF rozetine sahip olmalı', () => {
      const step = createMockGraphStep({
        currentNodeId: 'A',
        visitedNodeIds: ['A'],
        frontierNodeIds: [],
      });

      const { container } = render(
        <GraphVisualizer step={step} initialGraph={sampleGraph} />
      );

      const nodeA = container.querySelector('.graph-node.node-current');
      expect(nodeA).not.toBeNull();
      expect(screen.getByText('AKTİF')).not.toBeNull();
    });

    it('Kuyrukta (frontierNodeIds) olan düğümler node-in-queue sınıfı ve KUYRUKTA rozetine sahip olmalı', () => {
      const step = createMockGraphStep({
        currentNodeId: 'A',
        frontierNodeIds: ['B', 'C'],
        visitedNodeIds: ['A', 'B', 'C'],
      });

      const { container } = render(
        <GraphVisualizer step={step} initialGraph={sampleGraph} />
      );

      const queueNodes = container.querySelectorAll('.graph-node.node-in-queue');
      expect(queueNodes.length).toBe(2);
      expect(screen.getAllByText('KUYRUKTA').length).toBe(2);
    });

    it('Ziyaret edilmiş düğümler node-visited sınıfı ve ZİYARET EDİLDİ rozetine sahip olmalı', () => {
      const step = createMockGraphStep({
        currentNodeId: undefined,
        frontierNodeIds: [],
        visitedNodeIds: ['A', 'B', 'C'],
      });

      const { container } = render(
        <GraphVisualizer step={step} initialGraph={sampleGraph} />
      );

      const visitedNodes = container.querySelectorAll('.graph-node.node-visited');
      expect(visitedNodes.length).toBe(3);
      expect(screen.getAllByText('ZİYARET EDİLDİ').length).toBe(3);
    });
  });

  describe('3. Real-Time Queue Visualizer Drawer Tests', () => {
    it('Kuyruktaki elemanlar (queueItems) doğru sayıda .queue-item-box kutusu olarak render edilmeli', () => {
      const step = createMockGraphStep({
        meta: { kind: 'bfs', queue: ['B', 'C'], currentNode: 'A' },
      });

      const { container } = render(
        <GraphVisualizer step={step} initialGraph={sampleGraph} />
      );

      const queueBoxes = container.querySelectorAll('.queue-item-box');
      expect(queueBoxes.length).toBe(2);
      expect(queueBoxes[0].textContent).toBe('B');
      expect(queueBoxes[1].textContent).toBe('C');
    });

    it('Kuyruk boş olduğunda "Kuyruk Boş (Queue Empty)" metni gösterilmeli', () => {
      const step = createMockGraphStep({
        frontierNodeIds: [],
        meta: { kind: 'bfs', queue: [], currentNode: undefined },
      });

      render(<GraphVisualizer step={step} initialGraph={sampleGraph} />);

      expect(screen.getByText('Kuyruk Boş (Queue Empty)')).not.toBeNull();
    });

    it('DFS adımında YIĞINDA rozeti ve DFS YIĞIN (Stack - LIFO) paneli render edilmeli', () => {
      const step = createMockGraphStep({
        frontierNodeIds: ['B'],
        meta: { kind: 'dfs', stack: ['B'], currentNode: 'A' },
      });

      render(<GraphVisualizer step={step} initialGraph={sampleGraph} />);

      expect(screen.getByText('YIĞINDA')).not.toBeNull();
      expect(screen.getByText('DFS YIĞIN (Stack - LIFO):')).not.toBeNull();
    });
  });
});
