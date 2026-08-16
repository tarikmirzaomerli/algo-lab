import type { GraphData, GraphSimulationEvent } from '../../../types/graph';
import type { GraphAlgorithm, AlgorithmMetadata } from '../../../types/algorithm';

export const dfsMetadata: AlgorithmMetadata = {
  id: 'dfs',
  name: 'DFS (Depth-First Search / Derinlik Öncelikli Arama)',
  category: 'graph',
  description:
    'Graf yapısında başlangıç düğümünden itibaren gidilebilen en derin düğüme kadar ilerleyen, çıkmaz sokağa girildiğinde geri adımlayarak (backtracking) diğer dalları keşfeden Yığın (Stack - LIFO) tabanlı arama algoritmasıdır.',
  howItWorks: [
    'Başlangıç düğümü seçilir ve Yığına (Stack / LIFO) eklenir (PUSH).',
    'Yığın boşalana kadar en üstteki düğüm çekilir (POP).',
    'Eğer düğüm henüz ziyaret edilmediyse, Ziyaret Edilenler kümesine eklenir ve aktif düğüm ilan edilir (VISIT_NODE).',
    'Aktif düğümün henüz ziyaret edilmemiş komşuları taranır (TRAVERSE_EDGE).',
    'Komşular Yığına sürülür (PUSH).',
    'Tüm erişilebilir düğümler taranana veya hedef düğüm bulunana kadar işlem devam eder.',
  ],
  realWorldApplications: [
    'Devre ve Ağ Döngü Tespiti (Cycle Detection).',
    'Topolojik Sıralama (Topological Sort / Bağımlılık sıralaması).',
    'Labirent ve Bulmaca Çözümü (Backtracking).',
    'Graf Bağlı Bileşenlerinin (Connected Components) Tespiti.',
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
    stable: false,
    inPlace: false,
  },
};

export const dfs: GraphAlgorithm = {
  metadata: dfsMetadata,

  generateSteps(
    graph: GraphData,
    startNodeId: string,
    targetNodeId?: string
  ): GraphSimulationEvent[] {
    type RawGraphEvent = Omit<GraphSimulationEvent, 'stepIndex' | 'totalSteps'>;
    const rawEvents: RawGraphEvent[] = [];

    if (!graph || !graph.nodes || graph.nodes.length === 0) {
      return [];
    }

    const startNodeExists = graph.nodes.some((n) => n.id === startNodeId);
    if (!startNodeExists) {
      return [];
    }

    // Komşuluk Listesi (Adjacency List) Oluştur
    const adjMap = new Map<string, string[]>();
    graph.nodes.forEach((n) => adjMap.set(n.id, []));

    graph.edges.forEach((edge) => {
      adjMap.get(edge.source)?.push(edge.target);
      if (!graph.isDirected) {
        adjMap.get(edge.target)?.push(edge.source);
      }
    });

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
    const stack: string[] = [];
    const visitedNodeIds: string[] = [];
    let traversedEdgesCount = 0;
    let maxFrontierSize = 0;

    const updateMaxFrontier = () => {
      if (stack.length > maxFrontierSize) {
        maxFrontierSize = stack.length;
      }
    };

    // 1. Başlangıç Düğümünü Yığına (Stack) Ekle
    stack.push(startNodeId);
    updateMaxFrontier();

    rawEvents.push({
      type: 'PUSH',
      currentNodeId: startNodeId,
      visitedNodeIds: [...visitedNodeIds],
      frontierNodeIds: [...stack],
      targetNodeId,
      stats: {
        visitedCount: visited.size,
        traversedEdgesCount,
        maxFrontierSize,
      },
      meta: {
        kind: 'dfs',
        stack: [...stack],
        currentNode: startNodeId,
      },
    });

    // 2. DFS Yığın Döngüsü
    while (stack.length > 0) {
      const current = stack.pop()!;

      // POP Olayı
      rawEvents.push({
        type: 'POP',
        currentNodeId: current,
        visitedNodeIds: [...visitedNodeIds],
        frontierNodeIds: [...stack],
        targetNodeId,
        stats: {
          visitedCount: visited.size,
          traversedEdgesCount,
          maxFrontierSize,
        },
        meta: {
          kind: 'dfs',
          stack: [...stack],
          currentNode: current,
        },
      });

      // Eğer düğüm daha önce ziyaret edildiyse atla
      if (visited.has(current)) {
        continue;
      }

      // Düğümü Ziyaret Edildi Olarak İşaretle
      visited.add(current);
      visitedNodeIds.push(current);

      // VISIT_NODE Olayı
      rawEvents.push({
        type: 'VISIT_NODE',
        currentNodeId: current,
        visitedNodeIds: [...visitedNodeIds],
        frontierNodeIds: [...stack],
        targetNodeId,
        stats: {
          visitedCount: visited.size,
          traversedEdgesCount,
          maxFrontierSize,
        },
        meta: {
          kind: 'dfs',
          stack: [...stack],
          currentNode: current,
        },
      });

      // Hedef Düğüm Bulundu mu?
      if (targetNodeId && current === targetNodeId) {
        break;
      }

      // Komşuları Tara (LIFO mantığı gereği ters sırayla push etmek öncelikli komşudan başlamayı sağlar)
      const neighbors = adjMap.get(current) || [];
      const unvisitedNeighbors = neighbors.filter((n) => !visited.has(n));

      // Komşuları Yığına PUSH et
      for (let i = unvisitedNeighbors.length - 1; i >= 0; i--) {
        const neighbor = unvisitedNeighbors[i];
        traversedEdgesCount++;
        const activeEdgeId = findEdgeId(current, neighbor);

        // TRAVERSE_EDGE Olayı
        rawEvents.push({
          type: 'TRAVERSE_EDGE',
          currentNodeId: current,
          activeEdgeId,
          visitedNodeIds: [...visitedNodeIds],
          frontierNodeIds: [...stack],
          targetNodeId,
          stats: {
            visitedCount: visited.size,
            traversedEdgesCount,
            maxFrontierSize,
          },
          meta: {
            kind: 'dfs',
            stack: [...stack],
            currentNode: current,
          },
        });

        stack.push(neighbor);
        updateMaxFrontier();

        // PUSH Olayı
        rawEvents.push({
          type: 'PUSH',
          currentNodeId: neighbor,
          visitedNodeIds: [...visitedNodeIds],
          frontierNodeIds: [...stack],
          targetNodeId,
          stats: {
            visitedCount: visited.size,
            traversedEdgesCount,
            maxFrontierSize,
          },
          meta: {
            kind: 'dfs',
            stack: [...stack],
            currentNode: neighbor,
          },
        });
      }
    }

    // 3. COMPLETE Olayı
    rawEvents.push({
      type: 'COMPLETE',
      currentNodeId: visitedNodeIds[visitedNodeIds.length - 1],
      visitedNodeIds: [...visitedNodeIds],
      frontierNodeIds: [],
      targetNodeId,
      stats: {
        visitedCount: visited.size,
        traversedEdgesCount,
        maxFrontierSize,
      },
      meta: {
        kind: 'dfs',
        stack: [],
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
