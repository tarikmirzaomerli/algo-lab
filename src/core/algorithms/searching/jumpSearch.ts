import type { ArrayAlgorithm, AlgorithmMetadata } from '../../../types/algorithm';
import type { SimulationEvent } from '../../../types/event';

export const jumpSearchMetadata: AlgorithmMetadata = {
  id: 'jump-search',
  name: 'Jump Search (Sıçrama Araması)',
  category: 'searching',
  description:
    'Sıralı dizilerde sabit blok adımlarıyla sıçrayarak hedef bloğu belirleyen ve blok içinde doğrusal arama yapan verimli bir arama algoritmasıdır.',
  howItWorks: [
    'Optimal sıçrama adım boyutu hesaplanır: step = Math.floor(Math.sqrt(n)).',
    'Dizi üzerinde step adımlarıyla ileri sıçramalar yapılır.',
    'Sıçranılan yerdeki değer hedef değerden küçük olduğu sürece sıçramaya devam edilir.',
    'Hedef değerden büyük veya eşit bir elemana ulaşıldığında hedef blok tespit edilmiş olur.',
    'Bulunan blok sınırları içerisinde geri dönülerek doğrusal arama (Linear Search) yapılır.',
  ],
  realWorldApplications: [
    'Geriye doğru atlamanın maliyetli olduğu tek yönlü bağlı listeler veya akış verileri.',
    'İkili arama (Binary Search) jumping maliyetinin yüksek olduğu sistemler.',
  ],
  complexity: {
    time: {
      best: 'O(1)',
      average: 'O(√n)',
      worst: 'O(√n)',
    },
    space: 'O(1)',
  },
  properties: {
    stable: true,
    inPlace: true,
  },
};

export const jumpSearch: ArrayAlgorithm = {
  metadata: jumpSearchMetadata,

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

    const blockSize = Math.max(1, Math.floor(Math.sqrt(n)));
    let prev = 0;
    let step = blockSize;
    let comparisons = 0;
    let found = false;
    let foundIndex = -1;
    let lastStep: SimulationEvent | null = null;

    // 1. Jump Aşaması: Blok sınırları kontrol edilerek hedefin bulunabileceği blok aranır
    while (prev < n) {
      const jumpIndex = Math.min(step, n) - 1;
      const currentVal = initialArray[jumpIndex];
      comparisons++;

      const compareEvent: SimulationEvent = {
        stepIndex: events.length + 1,
        totalSteps: 0,
        type: 'COMPARE',
        indices: [jumpIndex],
        values: [currentVal, searchTarget],
        arraySnapshot: [...initialArray],
        sortedIndices: currentVal === searchTarget ? [jumpIndex] : [],
        subArrayRange: [prev, Math.min(step - 1, n - 1)],
        stats: {
          pass: 1,
          comparisons,
          swaps: 0,
        },
        meta: {
          kind: 'jump-search',
          blockSize,
          blockStart: prev,
          blockEnd: Math.min(step - 1, n - 1),
          phase: 'jump',
        },
      };

      events.push(compareEvent);
      lastStep = compareEvent;

      if (currentVal === searchTarget) {
        found = true;
        foundIndex = jumpIndex;
        break;
      }

      if (currentVal > searchTarget || step >= n) {
        // Hedefin bulunabileceği blok tespit edildi veya dizi sonuna ulaşıldı
        break;
      }

      prev = step;
      step += blockSize;
    }

    // 2. Linear Scan Aşaması: Eğer tam jump noktasında doğrudan bulunmadıysa, tespit edilen blok içi taranır
    if (!found && prev < n) {
      const blockStart = prev;
      const blockEnd = Math.min(step - 1, n - 1);

      for (let i = blockStart; i <= blockEnd; i++) {
        const currentVal = initialArray[i];
        comparisons++;

        if (currentVal === searchTarget) {
          found = true;
          foundIndex = i;

          const compareEvent: SimulationEvent = {
            stepIndex: events.length + 1,
            totalSteps: 0,
            type: 'COMPARE',
            indices: [i],
            values: [currentVal, searchTarget],
            arraySnapshot: [...initialArray],
            sortedIndices: [i],
            subArrayRange: [blockStart, blockEnd],
            stats: {
              pass: 1,
              comparisons,
              swaps: 0,
            },
            meta: {
              kind: 'jump-search',
              blockSize,
              blockStart,
              blockEnd,
              phase: 'linear',
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
            indices: [i],
            values: [currentVal, searchTarget],
            arraySnapshot: [...initialArray],
            sortedIndices: [],
            subArrayRange: [blockStart, blockEnd],
            stats: {
              pass: 1,
              comparisons,
              swaps: 0,
            },
            meta: {
              kind: 'jump-search',
              blockSize,
              blockStart,
              blockEnd,
              phase: 'linear',
            },
          };
          events.push(compareEvent);
          lastStep = compareEvent;

          if (currentVal > searchTarget) {
            // Dizi sıralı olduğu için hedef bu blokta bulunamıyor demektir
            break;
          }
        }
      }
    }

    const lastJumpMeta = lastStep?.meta?.kind === 'jump-search' ? lastStep.meta : undefined;

    // 3. Complete Event: Arama tamamlandı
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
        kind: 'jump-search',
        blockSize,
        blockStart: lastJumpMeta ? lastJumpMeta.blockStart : prev,
        blockEnd: lastJumpMeta ? lastJumpMeta.blockEnd : Math.min(step - 1, n - 1),
        phase: lastJumpMeta ? lastJumpMeta.phase : 'linear',
      },
    });

    const totalSteps = events.length;
    events.forEach((event) => {
      event.totalSteps = totalSteps;
    });

    return events;
  },
};
