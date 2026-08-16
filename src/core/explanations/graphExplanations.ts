import type { GraphSimulationEvent } from '../../types/graph';
import type { StepExplanation } from '../../types/event';

/**
 * Graf Algoritmaları için Adım Açıklaması Üreticisi
 */
export function explainGraphStep(event: GraphSimulationEvent): StepExplanation {
  const { type, currentNodeId, activeEdgeId, targetNodeId, stats, meta } = event;
  const queueList = meta?.kind === 'bfs' ? meta.queue.join(', ') : '';
  const stackList = meta?.kind === 'dfs' ? meta.stack.join(', ') : '';

  switch (type) {
    case 'ENQUEUE':
      return {
        title: `Kuyruğa Eklendi: Düğüm ${currentNodeId || ''}`,
        description: `Düğüm '${currentNodeId || ''}' keşfedildi ve BFS kuyruğuna (FIFO) eklendi.`,
        formula: queueList ? `Kuyruk: [${queueList}]` : undefined,
      };

    case 'DEQUEUE':
      return {
        title: `Kuyruktan Çıkarıldı: Düğüm ${currentNodeId || ''}`,
        description: `Sıradaki düğüm '${currentNodeId || ''}' işlenmek üzere kuyruktan çıkarıldı.`,
        formula: queueList ? `Kuyruk: [${queueList}]` : 'Kuyruk Boş',
      };

    case 'PUSH':
      return {
        title: `Yığına (Stack) İtildi: Düğüm ${currentNodeId || ''}`,
        description: `Düğüm '${currentNodeId || ''}' keşfedildi ve DFS yığınının en üstüne (LIFO) eklendi.`,
        formula: stackList ? `Yığın: [${stackList}]` : undefined,
      };

    case 'POP':
      return {
        title: `Yığından (Stack) Çıkarıldı: Düğüm ${currentNodeId || ''}`,
        description: `Yığının en üstündeki düğüm '${currentNodeId || ''}' işlenmek üzere çekildi.`,
        formula: stackList ? `Yığın: [${stackList}]` : 'Yığın Boş',
      };

    case 'VISIT_NODE':
      return {
        title: `Düğüm İnceleniyor: Düğüm ${currentNodeId || ''}`,
        description: `Düğüm '${currentNodeId || ''}' aktif düğümdür. Komşuları sırayla taranıyor.`,
        formula: `Gezilen Düğüm Sayısı: ${stats.visitedCount}`,
      };

    case 'TRAVERSE_EDGE':
      return {
        title: `Kenar Taranıyor: ${activeEdgeId || 'Bağlantı'}`,
        description: `Aktif düğüm '${currentNodeId || ''}' üzerinden komşu bağlantısı inceleniyor.`,
        formula: `Toplam Taranan Kenar: ${stats.traversedEdgesCount}`,
      };

    case 'COMPLETE':
      if (targetNodeId && currentNodeId === targetNodeId) {
        return {
          title: `Çizge Araması Başarıyla Tamamlandı!`,
          description: `Hedef düğüm '${targetNodeId}' başarıyla bulundu! Toplam ${stats.visitedCount} düğüm ziyaret edildi.`,
          formula: `Hedef Düğüm: ${targetNodeId}`,
        };
      }
      return {
        title: `Çizge Taraması Tamamlandı!`,
        description: `Graf üzerindeki erişilebilir tüm düğümler (Toplam ${stats.visitedCount} düğüm) derinlemesine ziyaret edildi.`,
        formula: `Toplam Ziyaret: ${stats.visitedCount} düğüm`,
      };

    default:
      return {
        title: `Adım ${event.stepIndex}`,
        description: `Graf simülasyon adımı gerçekleştiriliyor...`,
      };
  }
}
