import type { ArrayAlgorithm, AlgorithmMetadata } from '../../../types/algorithm';
import type { SimulationEvent } from '../../../types/event';

export const linearSearchMetadata: AlgorithmMetadata = {
  id: 'linear-search',
  name: 'Linear Search (Doğrusal Arama)',
  category: 'searching',
  description:
    'Dizinin başından sonuna kadar elemanları sırayla tek tek kontrol ederek hedef değeri arayan en temel arama algoritmasıdır.',
  howItWorks: [
    'Dizinin ilk elemanından (indeks 0) başlanır.',
    'Mevcut eleman aranan hedef değer ile karşılaştırılır.',
    'Eğer değer eşleşirse arama tamamlanır.',
    'Eşleşmezse bir sonraki indekse geçilir.',
    'Dizinin sonuna kadar eşleşme bulunamazsa elemanın dizide olmadığı bildirilir.',
  ],
  realWorldApplications: [
    'Küçük veya sırasız listelerde arama yapılması.',
    'Veri setinin önceden sıralanamadığı dinamik akışlar.',
    'Veritabanlarında indekslenmemiş sütunlarda tam tarama (Full Table Scan).',
  ],
  complexity: {
    time: {
      best: 'O(1)',
      average: 'O(n)',
      worst: 'O(n)',
    },
    space: 'O(1)',
  },
  properties: {
    stable: true,
    inPlace: true,
  },
};

export const linearSearch: ArrayAlgorithm = {
  metadata: linearSearchMetadata,

  generateSteps(initialArray: number[], target?: number): SimulationEvent[] {
    const events: SimulationEvent[] = [];

    if (initialArray.length === 0) {
      return events;
    }

    const searchTarget =
      target !== undefined
        ? target
        : initialArray[0];

    let comparisons = 0;
    let found = false;

    for (let i = 0; i < initialArray.length; i++) {
      comparisons++;
      const currentVal = initialArray[i];

      if (currentVal === searchTarget) {
        found = true;
        events.push({
          stepIndex: events.length + 1,
          totalSteps: 0,
          type: 'COMPARE',
          indices: [i],
          values: [currentVal, searchTarget],
          arraySnapshot: [...initialArray],
          sortedIndices: [i],
          stats: {
            pass: 1,
            comparisons,
            swaps: 0,
          },
          meta: {
            kind: 'linear-search',
          },
        });
        break;
      } else {
        events.push({
          stepIndex: events.length + 1,
          totalSteps: 0,
          type: 'COMPARE',
          indices: [i],
          values: [currentVal, searchTarget],
          arraySnapshot: [...initialArray],
          sortedIndices: [],
          stats: {
            pass: 1,
            comparisons,
            swaps: 0,
          },
          meta: {
            kind: 'linear-search',
          },
        });
      }
    }

    const lastStep = events[events.length - 1];

    events.push({
      stepIndex: events.length + 1,
      totalSteps: 0,
      type: 'COMPLETE',
      indices: found && lastStep ? lastStep.indices : [],
      values: found && lastStep ? lastStep.values : [searchTarget],
      arraySnapshot: [...initialArray],
      sortedIndices: found && lastStep ? lastStep.sortedIndices : [],
      stats: {
        pass: 1,
        comparisons,
        swaps: 0,
      },
      meta: {
        kind: 'linear-search',
      },
    });

    const totalSteps = events.length;
    events.forEach((event) => {
      event.totalSteps = totalSteps;
    });

    return events;
  },
};
