import type { ArrayAlgorithm } from '../../../types/algorithm';
import type { SimulationEvent } from '../../../types/event';

export const interpolationSearch: ArrayAlgorithm = {
  metadata: {
    id: 'interpolation-search',
    name: 'Interpolation Search',
    category: 'searching',
    description:
      'Interpolation Search (İnterpolasyon Araması), sıralı dizilerde hedef değerin dizideki göreceli sayısal konumunu orantılayarak tahmin eden ve her adımda hedef konuma doğru doğrudan sıçrayan gelişmiş bir arama algoritmasıdır.',
    howItWorks: [
      'Dizinin alt (low) ve üst (high) sınır değerleri belirlenir.',
      'Hedef değerin bu sınırlar arasındaki orantılı konumu (pos) tahmin edilir.',
      'Tahmin edilen indeksteki eleman hedef değerle karşılaştırılır.',
      'Hedef küçükse üst sınır daraltılır, büyükse alt sınır daraltılır, eşitse arama başarıyla tamamlanır.',
    ],
    realWorldApplications: [
      'Telefon rehberlerinde harf sırasına göre tahminleme yaparak arama (örn: "Y" harfi rehberin sonlarında aranır)',
      'Sözlüklerde veya sıralı veritabanı indekslerinde (B-Tree/Interpolation Index) hızlı konum tahmini',
      'Düzgün dağılımlı sayısal veri kümelerinde ve zaman serilerinde hızlı konum bulma',
    ],
    complexity: {
      time: {
        best: 'O(1)',
        average: 'O(log log n)',
        worst: 'O(n)',
      },
      space: 'O(1)',
    },
    properties: {
      stable: true,
      inPlace: true,
    },
  },

  generateSteps(array: number[], target?: number): SimulationEvent[] {
    const rawEvents: Omit<SimulationEvent, 'stepIndex' | 'totalSteps'>[] = [];
    const n = array.length;

    if (n === 0) {
      return [];
    }

    const targetVal = target ?? array[0];
    let comparisons = 0;
    let low = 0;
    let high = n - 1;
    let foundIndex = -1;

    // Out of bounds check with explicit comparison event
    if (targetVal < array[low] || targetVal > array[high]) {
      comparisons++;
      rawEvents.push({
        type: 'COMPARE',
        indices: [low],
        values: [array[low], targetVal],
        arraySnapshot: [...array],
        sortedIndices: [],
        stats: { pass: 1, comparisons, swaps: 0 },
        meta: {
          kind: 'interpolation-search',
          low,
          high,
          probe: low,
          phase: 'interpolate',
        },
      });
    } else {
      while (low <= high && targetVal >= array[low] && targetVal <= array[high]) {
      // 1. Durum: Alt ve üst sınır değerleri eşitse
      if (array[low] === array[high]) {
        comparisons++;
        rawEvents.push({
          type: 'COMPARE',
          indices: [low],
          values: [array[low], targetVal],
          arraySnapshot: [...array],
          sortedIndices: [],
          stats: { pass: 1, comparisons, swaps: 0 },
          meta: {
            kind: 'interpolation-search',
            low,
            high,
            probe: low,
            phase: 'interpolate',
          },
        });

        if (array[low] === targetVal) {
          foundIndex = low;
        }
        break;
      }

      // 2. Durum: Interpolasyon Formülü ile Tahmini İndeks Hesaplama
      // pos = low + Math.floor(((target - arr[low]) * (high - low)) / (arr[high] - arr[low]))
      const numerator = (targetVal - array[low]) * (high - low);
      const denominator = array[high] - array[low];
      const pos = low + Math.floor(numerator / denominator);

      // Güvenlik: pos değerinin [low .. high] aralığında kaldığından emin ol
      const probeIndex = Math.max(low, Math.min(high, pos));

      comparisons++;
      rawEvents.push({
        type: 'COMPARE',
        indices: [probeIndex],
        values: [array[probeIndex], targetVal],
        arraySnapshot: [...array],
        sortedIndices: [],
        stats: { pass: 1, comparisons, swaps: 0 },
        meta: {
          kind: 'interpolation-search',
          low,
          high,
          probe: probeIndex,
          phase: 'interpolate',
        },
      });

      if (array[probeIndex] === targetVal) {
        foundIndex = probeIndex;
        break;
      }

      if (array[probeIndex] < targetVal) {
        low = probeIndex + 1;
      } else {
        high = probeIndex - 1;
      }
    }
  }

    // Tamamlanma Adımı
    rawEvents.push({
      type: 'COMPLETE',
      indices: foundIndex !== -1 ? [foundIndex] : [],
      values: foundIndex !== -1 ? [array[foundIndex], targetVal] : [targetVal],
      arraySnapshot: [...array],
      sortedIndices: foundIndex !== -1 ? [foundIndex] : [],
      stats: { pass: 1, comparisons, swaps: 0 },
      meta: {
        kind: 'interpolation-search',
        low,
        high,
        probe: foundIndex !== -1 ? foundIndex : low,
        phase: 'interpolate',
      },
    });

    return rawEvents.map((e, idx) => ({
      ...e,
      stepIndex: idx + 1,
      totalSteps: rawEvents.length,
    }));
  },
};
