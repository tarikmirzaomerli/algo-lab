import { describe, it, expect } from 'vitest';
import { bfs } from '../../core/algorithms/graph/bfs';
import type { GraphData } from '../../types/graph';

describe('BFS (Breadth-First Search) Algorithm Tests', () => {
  // Scenario 1: Connected simple graph (4 nodes: A connected to B and C, B connected to D)
  const simpleConnectedGraph: GraphData = {
    nodes: [
      { id: 'A', label: 'A', x: 0, y: 0 },
      { id: 'B', label: 'B', x: 10, y: 10 },
      { id: 'C', label: 'C', x: 20, y: 20 },
      { id: 'D', label: 'D', x: 30, y: 30 },
    ],
    edges: [
      { id: 'e-A-B', source: 'A', target: 'B' },
      { id: 'e-A-C', source: 'A', target: 'C' },
      { id: 'e-B-D', source: 'B', target: 'D' },
    ],
    isDirected: false,
  };

  it('SENARYO 1: Bağlı basit graf üzerinde tüm düğümleri katman katman ziyaret etmeli', () => {
    const steps = bfs.generateSteps(simpleConnectedGraph, 'A');

    expect(steps.length).toBeGreaterThan(0);

    const firstStep = steps[0];
    expect(firstStep.type).toBe('ENQUEUE');
    expect(firstStep.currentNodeId).toBe('A');
    expect(firstStep.frontierNodeIds).toContain('A');

    const lastStep = steps[steps.length - 1];
    expect(lastStep.type).toBe('COMPLETE');
    expect(lastStep.visitedNodeIds).toEqual(['A', 'B', 'C', 'D']);
    expect(lastStep.stats.visitedCount).toBe(4);
    expect(lastStep.stats.traversedEdgesCount).toBeGreaterThan(0);
  });

  it('SENARYO 2: Tek düğümlü graf üzerinde doğru çalışmalı ve sonlanmalı', () => {
    const singleNodeGraph: GraphData = {
      nodes: [{ id: 'A', label: 'A', x: 0, y: 0 }],
      edges: [],
      isDirected: false,
    };

    const steps = bfs.generateSteps(singleNodeGraph, 'A');

    expect(steps.length).toBeGreaterThan(0);
    const lastStep = steps[steps.length - 1];
    expect(lastStep.type).toBe('COMPLETE');
    expect(lastStep.visitedNodeIds).toEqual(['A']);
    expect(lastStep.stats.visitedCount).toBe(1);
    expect(lastStep.stats.traversedEdgesCount).toBe(0);
  });

  it('SENARYO 3: İzole/Erişilemez düğüm içeren graf üzerinde erişilemeyen düğümleri ziyaret etmemeli', () => {
    const disconnectedGraph: GraphData = {
      nodes: [
        { id: 'A', label: 'A', x: 0, y: 0 },
        { id: 'B', label: 'B', x: 10, y: 10 },
        { id: 'ISOLATED', label: 'Isolated Node', x: 50, y: 50 },
      ],
      edges: [{ id: 'e-A-B', source: 'A', target: 'B' }],
      isDirected: false,
    };

    const steps = bfs.generateSteps(disconnectedGraph, 'A');

    const lastStep = steps[steps.length - 1];
    expect(lastStep.type).toBe('COMPLETE');
    expect(lastStep.visitedNodeIds).toEqual(['A', 'B']);
    expect(lastStep.visitedNodeIds).not.toContain('ISOLATED');
    expect(lastStep.stats.visitedCount).toBe(2);
  });

  it('SENARYO 4: Döngü (Cycle) içeren graf üzerinde sonsuz döngüye girmemeli', () => {
    // Triangle cycle: A - B - C - A
    const cyclicGraph: GraphData = {
      nodes: [
        { id: 'A', label: 'A', x: 0, y: 0 },
        { id: 'B', label: 'B', x: 10, y: 10 },
        { id: 'C', label: 'C', x: 20, y: 20 },
      ],
      edges: [
        { id: 'e-A-B', source: 'A', target: 'B' },
        { id: 'e-B-C', source: 'B', target: 'C' },
        { id: 'e-C-A', source: 'C', target: 'A' },
      ],
      isDirected: false,
    };

    const steps = bfs.generateSteps(cyclicGraph, 'A');

    // Adım sayısı sonsuz döngüye girmeden makul bir sayıda sonlanmalı
    expect(steps.length).toBeLessThan(30);

    // Her düğüm tam olarak 1 kez ENQUEUE edilmeli (toplam 3 ENQUEUE)
    const enqueueSteps = steps.filter((s) => s.type === 'ENQUEUE');
    expect(enqueueSteps).toHaveLength(3);
    const enqueuedNodes = enqueueSteps.map((s) => s.currentNodeId);
    expect(new Set(enqueuedNodes).size).toBe(3);

    const lastStep = steps[steps.length - 1];
    expect(lastStep.type).toBe('COMPLETE');
    expect(lastStep.visitedNodeIds).toHaveLength(3);
    expect(lastStep.visitedNodeIds).toEqual(expect.arrayContaining(['A', 'B', 'C']));
  });

  it('SENARYO 5: Hedef düğüm (targetNodeId) verildiğinde hedefe ulaşınca erken sonlanmalı', () => {
    // Linear graph: A -> B -> C -> D
    const linearGraph: GraphData = {
      nodes: [
        { id: 'A', label: 'A', x: 0, y: 0 },
        { id: 'B', label: 'B', x: 10, y: 10 },
        { id: 'C', label: 'C', x: 20, y: 20 },
        { id: 'D', label: 'D', x: 30, y: 30 },
      ],
      edges: [
        { id: 'e-A-B', source: 'A', target: 'B' },
        { id: 'e-B-C', source: 'B', target: 'C' },
        { id: 'e-C-D', source: 'C', target: 'D' },
      ],
      isDirected: true,
    };

    const steps = bfs.generateSteps(linearGraph, 'A', 'B');

    const lastStep = steps[steps.length - 1];
    expect(lastStep.type).toBe('COMPLETE');
    expect(lastStep.visitedNodeIds).toEqual(['A', 'B']);
    expect(lastStep.visitedNodeIds).not.toContain('C');
    expect(lastStep.visitedNodeIds).not.toContain('D');
  });

  it('UÇ DURUMLAR: Boş graf veya geçersiz başlangıç düğümünde boş dizi dönmeli', () => {
    const emptyGraph: GraphData = { nodes: [], edges: [] };
    expect(bfs.generateSteps(emptyGraph, 'A')).toEqual([]);

    const invalidStartNodeGraph: GraphData = {
      nodes: [{ id: 'A', label: 'A', x: 0, y: 0 }],
      edges: [],
    };
    expect(bfs.generateSteps(invalidStartNodeGraph, 'NON_EXISTENT')).toEqual([]);
  });
});
