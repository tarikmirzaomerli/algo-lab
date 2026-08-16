import type { ArrayAlgorithm, AlgorithmMetadata } from '../../../types/algorithm';
import type { SimulationEvent } from '../../../types/event';

export const exponentialSearchMetadata: AlgorithmMetadata = {
  id: 'exponential-search',
  name: 'Exponential Search (Üstel Arama)',
  category: 'searching',
  description: 'Sıralı dizilerde arama sınırını iki katına çıkararak (1, 2, 4, 8...) hedef aralığı belirleyen ve ardından bu aralıkta Binary Search uygulayan algoritmadır.',
  howItWorks: [
    'İlk olarak 0. indeksteki eleman kontrol edilir.',
    'Sınır indeksi 1 kabul edilir ve eleman hedef değerden küçük olduğu sürece sınır iki katına çıkarılır (i = i * 2).',
    'Elemanın hedef değerden büyük veya eşit olduğu indeks bulunduğunda arama aralığı [i/2 .. min(i, n-1)] olarak sınırlandırılır.',
    'Belirlenen bu daraltılmış aralık üzerinde Binary Search (İkili Arama) çalıştırılır.',
  ],
  realWorldApplications: [
    'Sonsuz veya boyutu bilinmeyen sıralı veri akışlarında (Unbounded Arrays) arama.',
    'Hedef elemanın dizinin başlarına yakın olduğu durumlarda Binary Searchten daha hızlı sonuç alma.',
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

export const exponentialSearch: ArrayAlgorithm = {
  metadata: exponentialSearchMetadata,

  generateSteps(initialArray: number[], target?: number): SimulationEvent[] {
    const events: SimulationEvent[] = [];
    const n = initialArray.length;

    if (n === 0) {
      return events;
    }

    const searchTarget =
      target !== undefined
        ? target
        : initialArray[0];

    let comparisons = 0;
    let found = false;
    let foundIndex = -1;
    let lastStep: SimulationEvent | null = null;

    // 1. İlk eleman kontrolü (İndeks 0)
    comparisons++;
    const firstVal = initialArray[0];

    if (firstVal === searchTarget) {
      found = true;
      foundIndex = 0;
      const compareEvent: SimulationEvent = {
        stepIndex: events.length + 1,
        totalSteps: 0,
        type: 'COMPARE',
        indices: [0],
        values: [firstVal, searchTarget],
        arraySnapshot: [...initialArray],
        sortedIndices: [0],
        subArrayRange: [0, 0],
        stats: { pass: 1, comparisons, swaps: 0 },
        meta: {
          kind: 'exponential-search',
          phase: 'BOUND',
          boundIndex: 0,
          previousBound: 0,
        },
      };
      events.push(compareEvent);
      lastStep = compareEvent;
    } else {
      const compareEvent: SimulationEvent = {
        stepIndex: events.length + 1,
        totalSteps: 0,
        type: 'COMPARE',
        indices: [0],
        values: [firstVal, searchTarget],
        arraySnapshot: [...initialArray],
        sortedIndices: [],
        subArrayRange: [0, 0],
        stats: { pass: 1, comparisons, swaps: 0 },
        meta: {
          kind: 'exponential-search',
          phase: 'BOUND',
          boundIndex: 0,
          previousBound: 0,
        },
      };
      events.push(compareEvent);
      lastStep = compareEvent;

      // 2. BOUND (Arama Sınırı Genişletme) Aşaması: 1 -> 2 -> 4 -> 8 -> ...
      let prevBound = 0;
      let bound = 1;

      while (bound < n && initialArray[bound] < searchTarget) {
        comparisons++;
        const currentVal = initialArray[bound];

        const boundEvent: SimulationEvent = {
          stepIndex: events.length + 1,
          totalSteps: 0,
          type: 'COMPARE',
          indices: [bound],
          values: [currentVal, searchTarget],
          arraySnapshot: [...initialArray],
          sortedIndices: [],
          subArrayRange: [prevBound, Math.min(bound, n - 1)],
          stats: { pass: 1, comparisons, swaps: 0 },
          meta: {
            kind: 'exponential-search',
            phase: 'BOUND',
            boundIndex: bound,
            previousBound: prevBound,
          },
        };
        events.push(boundEvent);
        lastStep = boundEvent;

        prevBound = bound;
        bound = bound * 2;
      }

      // Sınır sınırının son kontrol noktası (dizi sınırları içindeyse)
      if (!found && bound < n) {
        comparisons++;
        const currentVal = initialArray[bound];
        const isMatch = currentVal === searchTarget;

        if (isMatch) {
          found = true;
          foundIndex = bound;
        }

        const boundEvent: SimulationEvent = {
          stepIndex: events.length + 1,
          totalSteps: 0,
          type: 'COMPARE',
          indices: [bound],
          values: [currentVal, searchTarget],
          arraySnapshot: [...initialArray],
          sortedIndices: isMatch ? [bound] : [],
          subArrayRange: [prevBound, Math.min(bound, n - 1)],
          stats: { pass: 1, comparisons, swaps: 0 },
          meta: {
            kind: 'exponential-search',
            phase: 'BOUND',
            boundIndex: bound,
            previousBound: prevBound,
          },
        };
        events.push(boundEvent);
        lastStep = boundEvent;
      }

      // 3. BINARY (İkili Arama) Aşaması: [prevBound .. min(bound, n - 1)] aralığında
      if (!found) {
        let low = prevBound;
        let high = Math.min(bound, n - 1);

        while (low <= high) {
          const mid = Math.floor((low + high) / 2);
          comparisons++;
          const currentVal = initialArray[mid];

          if (currentVal === searchTarget) {
            found = true;
            foundIndex = mid;
            const compareEvent: SimulationEvent = {
              stepIndex: events.length + 1,
              totalSteps: 0,
              type: 'COMPARE',
              indices: [mid],
              values: [currentVal, searchTarget],
              arraySnapshot: [...initialArray],
              sortedIndices: [mid],
              subArrayRange: [prevBound, Math.min(bound, n - 1)],
              stats: { pass: 1, comparisons, swaps: 0 },
              meta: {
                kind: 'exponential-search',
                phase: 'BINARY',
                low,
                mid,
                high,
                boundIndex: Math.min(bound, n - 1),
                previousBound: prevBound,
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
              subArrayRange: [prevBound, Math.min(bound, n - 1)],
              stats: { pass: 1, comparisons, swaps: 0 },
              meta: {
                kind: 'exponential-search',
                phase: 'BINARY',
                low,
                mid,
                high,
                boundIndex: Math.min(bound, n - 1),
                previousBound: prevBound,
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
      }
    }

    const lastExpoMeta = lastStep?.meta?.kind === 'exponential-search' ? lastStep.meta : undefined;

    // 4. Complete Event
    events.push({
      stepIndex: events.length + 1,
      totalSteps: 0,
      type: 'COMPLETE',
      indices: found && foundIndex !== -1 ? [foundIndex] : (lastStep ? lastStep.indices : []),
      values: found && foundIndex !== -1 ? [initialArray[foundIndex], searchTarget] : (lastStep ? lastStep.values : [searchTarget]),
      arraySnapshot: [...initialArray],
      sortedIndices: found && foundIndex !== -1 ? [foundIndex] : [],
      subArrayRange: lastStep?.subArrayRange,
      stats: {
        pass: 1,
        comparisons,
        swaps: 0,
      },
      meta: {
        kind: 'exponential-search',
        phase: lastExpoMeta ? lastExpoMeta.phase : 'BINARY',
        low: lastExpoMeta ? lastExpoMeta.low : undefined,
        mid: lastExpoMeta ? lastExpoMeta.mid : undefined,
        high: lastExpoMeta ? lastExpoMeta.high : undefined,
        boundIndex: lastExpoMeta ? lastExpoMeta.boundIndex : 0,
        previousBound: lastExpoMeta ? lastExpoMeta.previousBound : 0,
      },
    });

    const totalSteps = events.length;
    events.forEach((event) => {
      event.totalSteps = totalSteps;
    });

    return events;
  },
};
