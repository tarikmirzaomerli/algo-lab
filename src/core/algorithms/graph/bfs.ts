import type { GraphAlgorithm, AlgorithmMetadata } from '../../../types/algorithm';
import type { GraphData, GraphSimulationEvent } from '../../../types/graph';

export const bfsMetadata: AlgorithmMetadata = {
  id: 'bfs',
  name: 'BFS (Breadth-First Search / Genişlik Öncelikli Arama)',
  category: 'graph',
  description:
    'Graf yapısında başlangıç düğümünden itibaren katman katman genişleyerek arama yapan, ağırlıksız graflarda en kısa yolu bulan O(V + E) karmaşıklıklı temel arama algoritmasıdır.',
  howItWorks: [
    'Başlangıç düğümü seçilir ve Ziyaret Edilenler kümesine ile Kuyruğa (Queue / FIFO) eklenir.',
    'Kuyruğun en başındaki düğüm çıkarılır (DEQUEUE) ve o anki aktif düğüm (VISIT) ilan edilir.',
    'Aktif düğümün henüz ziyaret edilmemiş tüm komşuları taranır (TRAVERSE_EDGE).',
    'Ziyaret edilmemiş her komşu ziyaret edildi olarak işaretlenir ve Kuyruğa eklenir (ENQUEUE).',
    'Kuyruk tamamen boşalana kadar veya hedef düğüme ulaşılana kadar işlem devam eder.',
  ],
  realWorldApplications: [
    'GPS Navigasyon ve Harita Sistemleri (Ağırlıksız/En az aktarmalı rota bulma).',
    'Sosyal Ağlar (1. ve 2. derece arkadaş önerileri / Ortak bağlantı tespiti).',
    'Web Taraması (Web Crawler - Sayfaları katman katman dizine ekleme).',
    'Network Yayıncılığı (Broadcasting / Paketlerin en yakın cihazlara dağıtımı).',
  ],
  complexity: {
    time: {
      best: 'O(V + E)',
      average: 'O(V + E)',
      worst: 'O(V + E)',
    },
    space: 'O(V)',
  },
  properties: {
    stable: true,
    inPlace: false,
  },
};

export const bfs: GraphAlgorithm = {
  metadata: bfsMetadata,

  generateSteps(
    graph: GraphData,
    startNodeId: string,
    targetNodeId?: string
  ): GraphSimulationEvent[] {
    const rawEvents: Omit<GraphSimulationEvent, 'stepIndex' | 'totalSteps'>[] = [];

    if (!graph.nodes || graph.nodes.length === 0) {
      return [];
    }

    // Başlangıç düğümünün varlığını kontrol et
    const startNodeExists = graph.nodes.some((n) => n.id === startNodeId);
    if (!startNodeExists) {
      return [];
    }

    // Komşuluk Listesi (Adjacency List) Oluştur
    const adjMap = new Map<string, string[]>();
    for (const node of graph.nodes) {
      adjMap.set(node.id, []);
    }

    for (const edge of graph.edges) {
      adjMap.get(edge.source)?.push(edge.target);
      if (!graph.isDirected) {
        adjMap.get(edge.target)?.push(edge.source);
      }
    }

    // Kenar ID bulucu yardımcı fonksiyon
    const findEdgeId = (u: string, v: string): string | undefined => {
      const edge = graph.edges.find(
        (e) =>
          (e.source === u && e.target === v) ||
          (!graph.isDirected && e.source === v && e.target === u)
      );
      return edge?.id;
    };

    const visited = new Set<string>();
    const queue: string[] = [];
    const visitedNodeIds: string[] = [];
    let traversedEdgesCount = 0;
    let maxFrontierSize = 0;

    const updateMaxFrontier = () => {
      if (queue.length > maxFrontierSize) {
        maxFrontierSize = queue.length;
      }
    };

    // 1. Başlangıç Düğümünü Kuyruğa ve Visited Kümeye Ekle
    queue.push(startNodeId);
    visited.add(startNodeId);
    visitedNodeIds.push(startNodeId);
    updateMaxFrontier();

    rawEvents.push({
      type: 'ENQUEUE',
      currentNodeId: startNodeId,
      visitedNodeIds: [...visitedNodeIds],
      frontierNodeIds: [...queue],
      targetNodeId,
      stats: {
        visitedCount: visited.size,
        traversedEdgesCount,
        maxFrontierSize,
      },
      meta: {
        kind: 'bfs',
        queue: [...queue],
        currentNode: startNodeId,
      },
    });

    // 2. BFS Ana Döngüsü
    while (queue.length > 0) {
      const current = queue.shift()!;

      // DEQUEUE Olayı
      rawEvents.push({
        type: 'DEQUEUE',
        currentNodeId: current,
        visitedNodeIds: [...visitedNodeIds],
        frontierNodeIds: [...queue],
        targetNodeId,
        stats: {
          visitedCount: visited.size,
          traversedEdgesCount,
          maxFrontierSize,
        },
        meta: {
          kind: 'bfs',
          queue: [...queue],
          currentNode: current,
        },
      });

      // VISIT_NODE Olayı
      rawEvents.push({
        type: 'VISIT_NODE',
        currentNodeId: current,
        visitedNodeIds: [...visitedNodeIds],
        frontierNodeIds: [...queue],
        targetNodeId,
        stats: {
          visitedCount: visited.size,
          traversedEdgesCount,
          maxFrontierSize,
        },
        meta: {
          kind: 'bfs',
          queue: [...queue],
          currentNode: current,
        },
      });

      // Target Kontrolü (Hedef Düğüm Bulundu mu?)
      if (targetNodeId && current === targetNodeId) {
        break;
      }

      // Komşuları Tara
      const neighbors = adjMap.get(current) || [];
      for (const neighbor of neighbors) {
        traversedEdgesCount++;
        const activeEdgeId = findEdgeId(current, neighbor);

        // TRAVERSE_EDGE Olayı
        rawEvents.push({
          type: 'TRAVERSE_EDGE',
          currentNodeId: current,
          activeEdgeId,
          visitedNodeIds: [...visitedNodeIds],
          frontierNodeIds: [...queue],
          targetNodeId,
          stats: {
            visitedCount: visited.size,
            traversedEdgesCount,
            maxFrontierSize,
          },
          meta: {
            kind: 'bfs',
            queue: [...queue],
            currentNode: current,
          },
        });

        if (!visited.has(neighbor)) {
          visited.add(neighbor);
          visitedNodeIds.push(neighbor);
          queue.push(neighbor);
          updateMaxFrontier();

          // ENQUEUE Komşu Olayı
          rawEvents.push({
            type: 'ENQUEUE',
            currentNodeId: neighbor,
            activeEdgeId,
            visitedNodeIds: [...visitedNodeIds],
            frontierNodeIds: [...queue],
            targetNodeId,
            stats: {
              visitedCount: visited.size,
              traversedEdgesCount,
              maxFrontierSize,
            },
            meta: {
              kind: 'bfs',
              queue: [...queue],
              currentNode: neighbor,
            },
          });
        }
      }
    }

    // 3. COMPLETE Olayı
    rawEvents.push({
      type: 'COMPLETE',
      currentNodeId: targetNodeId && visited.has(targetNodeId) ? targetNodeId : undefined,
      visitedNodeIds: [...visitedNodeIds],
      frontierNodeIds: [],
      targetNodeId,
      stats: {
        visitedCount: visited.size,
        traversedEdgesCount,
        maxFrontierSize,
      },
      meta: {
        kind: 'bfs',
        queue: [],
        currentNode: undefined,
      },
    });

    const totalSteps = rawEvents.length;
    return rawEvents.map((ev, index) => ({
      ...ev,
      stepIndex: index + 1,
      totalSteps,
    }));
  },
};
