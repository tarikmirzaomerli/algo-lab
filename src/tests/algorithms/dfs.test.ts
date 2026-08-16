import { describe, it, expect } from 'vitest';
import { dfs } from '../../core/algorithms/graph/dfs';
import type { GraphData } from '../../types/graph';

describe('DFS Algoritma Çekirdeği Birim Testleri', () => {
  const sampleGraph: GraphData = {
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

  it('SENARYO 1: Bağlı basit bir grafta tüm düğümler DFS ile gezilmeli', () => {
    const steps = dfs.generateSteps(sampleGraph, 'A');

    expect(steps.length).toBeGreaterThan(0);

    const lastStep = steps[steps.length - 1];
    expect(lastStep.type).toBe('COMPLETE');
    expect(lastStep.visitedNodeIds).toHaveLength(4);
    expect(lastStep.visitedNodeIds).toEqual(
      expect.arrayContaining(['A', 'B', 'C', 'D'])
    );
  });

  it('SENARYO 2: Tek düğümlü bir grafta DFS çökmeden tamamlanmalı', () => {
    const singleNodeGraph: GraphData = {
      nodes: [{ id: 'A', label: 'A', x: 0, y: 0 }],
      edges: [],
      isDirected: false,
    };

    const steps = dfs.generateSteps(singleNodeGraph, 'A');

    const lastStep = steps[steps.length - 1];
    expect(lastStep.type).toBe('COMPLETE');
    expect(lastStep.visitedNodeIds).toEqual(['A']);
  });

  it('SENARYO 3: İzole (bağlantısız) düğüm içeren grafta sadece erişilebilir düğümler gezilmeli', () => {
    const graphWithIsolated: GraphData = {
      nodes: [
        { id: 'A', label: 'A', x: 0, y: 0 },
        { id: 'B', label: 'B', x: 10, y: 10 },
        { id: 'ISOLATED', label: 'ISO', x: 99, y: 99 },
      ],
      edges: [{ id: 'e-A-B', source: 'A', target: 'B' }],
      isDirected: false,
    };

    const steps = dfs.generateSteps(graphWithIsolated, 'A');

    const lastStep = steps[steps.length - 1];
    expect(lastStep.visitedNodeIds).toEqual(['A', 'B']);
    expect(lastStep.visitedNodeIds).not.toContain('ISOLATED');
  });

  it('SENARYO 4: Döngü (Cycle) içeren grafta DFS sonsuz döngüye girmemeli', () => {
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

    const steps = dfs.generateSteps(cyclicGraph, 'A');

    expect(steps.length).toBeLessThan(30);

    const lastStep = steps[steps.length - 1];
    expect(lastStep.type).toBe('COMPLETE');
    expect(lastStep.visitedNodeIds).toHaveLength(3);
    expect(lastStep.visitedNodeIds).toEqual(
      expect.arrayContaining(['A', 'B', 'C'])
    );
  });

  it('SENARYO 5: Hedef düğüm (targetNodeId) verildiğinde hedefe ulaşınca erken sonlanmalı', () => {
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
      isDirected: false,
    };

    const steps = dfs.generateSteps(linearGraph, 'A', 'B');

    const lastStep = steps[steps.length - 1];
    expect(lastStep.visitedNodeIds).toContain('B');
    expect(lastStep.visitedNodeIds).not.toContain('D');
  });

  it('UÇ DURUMLAR: Boş graf veya geçersiz başlangıç düğümünde boş dizi dönmeli', () => {
    const emptyGraph: GraphData = { nodes: [], edges: [], isDirected: false };
    expect(dfs.generateSteps(emptyGraph, 'A')).toEqual([]);

    expect(dfs.generateSteps(sampleGraph, 'NON_EXISTENT')).toEqual([]);
  });
});
