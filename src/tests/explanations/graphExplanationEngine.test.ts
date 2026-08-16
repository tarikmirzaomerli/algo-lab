import { describe, it, expect } from 'vitest';
import { explainGraphStep } from '../../core/explanations/graphExplanations';
import { enrichGraphEvents } from '../../core/explanations/graphExplanationEngine';
import type { GraphSimulationEvent } from '../../types/graph';

describe('Graph Explanation Engine (Çizge Anlatım Motoru) Birim Testleri', () => {
  const mockBaseStats = {
    visitedCount: 2,
    traversedEdgesCount: 3,
    maxFrontierSize: 2,
  };

  it('ENQUEUE olayı için doğru başlık ve formül üretilmeli', () => {
    const event: GraphSimulationEvent = {
      stepIndex: 1,
      totalSteps: 5,
      type: 'ENQUEUE',
      currentNodeId: 'B',
      visitedNodeIds: ['A', 'B'],
      frontierNodeIds: ['B'],
      stats: mockBaseStats,
      meta: { kind: 'bfs', queue: ['B'], currentNode: 'B' },
    };

    const explanation = explainGraphStep(event);
    expect(explanation.title).toContain('Kuyruğa Eklendi');
    expect(explanation.title).toContain('Düğüm B');
    expect(explanation.description).toContain("Düğüm 'B' keşfedildi");
    expect(explanation.formula).toBe('Kuyruk: [B]');
  });

  it('DEQUEUE olayı için doğru başlık ve formül üretilmeli', () => {
    const event: GraphSimulationEvent = {
      stepIndex: 2,
      totalSteps: 5,
      type: 'DEQUEUE',
      currentNodeId: 'B',
      visitedNodeIds: ['A', 'B'],
      frontierNodeIds: [],
      stats: mockBaseStats,
      meta: { kind: 'bfs', queue: [], currentNode: 'B' },
    };

    const explanation = explainGraphStep(event);
    expect(explanation.title).toContain('Kuyruktan Çıkarıldı');
    expect(explanation.formula).toBe('Kuyruk Boş');
  });

  it('PUSH olayı (DFS) için doğru başlık ve formül üretilmeli', () => {
    const event: GraphSimulationEvent = {
      stepIndex: 1,
      totalSteps: 5,
      type: 'PUSH',
      currentNodeId: 'C',
      visitedNodeIds: ['A'],
      frontierNodeIds: ['C'],
      stats: mockBaseStats,
      meta: { kind: 'dfs', stack: ['C'], currentNode: 'C' },
    };

    const explanation = explainGraphStep(event);
    expect(explanation.title).toContain('Yığına (Stack) İtildi');
    expect(explanation.formula).toBe('Yığın: [C]');
  });

  it('POP olayı (DFS) için doğru başlık ve formül üretilmeli', () => {
    const event: GraphSimulationEvent = {
      stepIndex: 2,
      totalSteps: 5,
      type: 'POP',
      currentNodeId: 'C',
      visitedNodeIds: ['A'],
      frontierNodeIds: [],
      stats: mockBaseStats,
      meta: { kind: 'dfs', stack: [], currentNode: 'C' },
    };

    const explanation = explainGraphStep(event);
    expect(explanation.title).toContain('Yığından (Stack) Çıkarıldı');
    expect(explanation.formula).toBe('Yığın Boş');
  });

  it('enrichGraphEvents ham olay dizisini eksiksiz açıklamalarla zenginleştirmeli', () => {
    const events: GraphSimulationEvent[] = [
      {
        stepIndex: 1,
        totalSteps: 2,
        type: 'VISIT_NODE',
        currentNodeId: 'A',
        visitedNodeIds: ['A'],
        frontierNodeIds: [],
        stats: mockBaseStats,
      },
      {
        stepIndex: 2,
        totalSteps: 2,
        type: 'COMPLETE',
        currentNodeId: 'A',
        visitedNodeIds: ['A'],
        frontierNodeIds: [],
        stats: mockBaseStats,
      },
    ];

    const enriched = enrichGraphEvents(events);
    expect(enriched).toHaveLength(2);
    expect(enriched[0].title).toBeDefined();
    expect(enriched[0].description).toBeDefined();
    expect(enriched[1].title).toContain('Tamamlandı');
  });
});
