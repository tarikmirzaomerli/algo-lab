import type { ArrayAlgorithm, AlgorithmMetadata } from '../../../types/algorithm';
import type { SimulationEvent } from '../../../types/event';

export const binarySearchMetadata: AlgorithmMetadata = {
  id: 'binary-search',
  name: 'Binary Search (İkili Arama)',
  category: 'searching',
  description:
    'Sıralı diziler üzerinde çalışan, her adımda arama aralığını yarıya indirerek hedefe O(log n) karmaşıklığında ulaşan böl-ve-yönet algoritmasıdır.',
  howItWorks: [
    'Arama aralığı başlangıçta tüm sıralı dizidir (low = 0, high = n - 1).',
    'Aralığın orta indeksi hesaplanır: mid = Math.floor((low + high) / 2).',
    'Orta eleman hedef değer ile karşılaştırılır.',
    'Hedef eşitse arama başarıyla sonlanır.',
    'Hedef ortadaki değerden küçükse arama sol yarıda (high = mid - 1) devam eder.',
    'Hedef ortadaki değerden büyükse arama sağ yarıda (low = mid + 1) devam eder.',
  ],
  realWorldApplications: [
    'İndekslenmiş veritabanı sorguları (B-Tree arama mantığı).',
    'Sözlük, telefon rehberi ve kütüphane katalog aramaları.',
    'Derleyicilerde sembol tablosu (symbol table) erişimi.',
  ],
  complexity: {
    time: {
      best: 'O(1)',
      average: 'O(log n)',
      worst: 'O(log n)',
    },
    space: 'O(1)',
  },
  properties: {
    stable: true,
    inPlace: true,
  },
};

export const binarySearch: ArrayAlgorithm = {
  metadata: binarySearchMetadata,

  generateSteps(initialArray: number[], target?: number): SimulationEvent[] {
    const events: SimulationEvent[] = [];

    if (initialArray.length === 0) {
      return events;
    }

    const searchTarget =
      target !== undefined
        ? target
        : initialArray[Math.floor(initialArray.length / 2)];

    let low = 0;
    let high = initialArray.length - 1;
    let comparisons = 0;
    let found = false;
    let lastStep: SimulationEvent | null = null;

    while (low <= high) {
      const mid = Math.floor((low + high) / 2);
      comparisons++;
      const currentVal = initialArray[mid];

      if (currentVal === searchTarget) {
        found = true;
        const compareEvent: SimulationEvent = {
          stepIndex: events.length + 1,
          totalSteps: 0,
          type: 'COMPARE',
          indices: [mid],
          values: [currentVal, searchTarget],
          arraySnapshot: [...initialArray],
          sortedIndices: [mid],
          subArrayRange: [low, high],
          stats: {
            pass: 1,
            comparisons,
            swaps: 0,
          },
          meta: {
            kind: 'binary-search',
            low,
            mid,
            high,
          },
        };
        events.push(compareEvent);
        lastStep = compareEvent;
        break;
      } else {
        const compareEvent: SimulationEvent = {
          stepIndex: events.length + 1,
          totalSteps: 0,
          type: 'COMPARE',
          indices: [mid],
          values: [currentVal, searchTarget],
          arraySnapshot: [...initialArray],
          sortedIndices: [],
          subArrayRange: [low, high],
          stats: {
            pass: 1,
            comparisons,
            swaps: 0,
          },
          meta: {
            kind: 'binary-search',
            low,
            mid,
            high,
          },
        };
        events.push(compareEvent);
        lastStep = compareEvent;

        if (currentVal < searchTarget) {
          low = mid + 1;
        } else {
          high = mid - 1;
        }
      }
    }

    const lastBinaryMeta = lastStep?.meta?.kind === 'binary-search' ? lastStep.meta : undefined;

    events.push({
      stepIndex: events.length + 1,
      totalSteps: 0,
      type: 'COMPLETE',
      indices: found && lastStep ? lastStep.indices : [],
      values: found && lastStep ? lastStep.values : [searchTarget],
      arraySnapshot: [...initialArray],
      sortedIndices: found && lastStep ? lastStep.sortedIndices : [],
      subArrayRange: lastStep?.subArrayRange,
      stats: {
        pass: 1,
        comparisons,
        swaps: 0,
      },
      meta: {
        kind: 'binary-search',
        low: lastBinaryMeta ? lastBinaryMeta.low : low,
        mid: lastBinaryMeta ? lastBinaryMeta.mid : 0,
        high: lastBinaryMeta ? lastBinaryMeta.high : high,
      },
    });

    const totalSteps = events.length;
    events.forEach((event) => {
      event.totalSteps = totalSteps;
    });

    return events;
  },
};
