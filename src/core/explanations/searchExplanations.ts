import type { SimulationEvent, StepExplanation } from '../../types/event';

/**
 * Arama algoritmalarına (Linear, Binary, Jump, Exponential, Interpolation) özel
 * adım açıklamalarını (StepExplanation) üreten modül.
 */
export function explainSearchStep(event: SimulationEvent): StepExplanation {
  const { type, indices, values, stats, meta } = event;
  const valA = values[0];
  const valB = values[1];
  const idxA = indices[0];

  if (type === 'COMPLETE') {
    const isMatch = event.sortedIndices.length > 0;
    if (isMatch) {
      const foundIdx = event.sortedIndices[0];
      const targetVal = valB ?? valA;
      return {
        title: 'Arama Başarıyla Tamamlandı!',
        description: `Arama tamamlandı. Hedef ${targetVal} sayısı İndeks ${foundIdx} konumunda bulundu. Toplam ${stats.comparisons} karşılaştırma yapıldı.`,
      };
    }
    const targetVal = valA;
    return {
      title: 'Arama Tamamlandı',
      description: `Arama tamamlandı. ${targetVal} değeri dizide bulunamadı. Toplam ${stats.comparisons} karşılaştırma yapıldı.`,
    };
  }

  // COMPARE adımları
  if (meta) {
    switch (meta.kind) {
      case 'exponential-search': {
        const isMatch = event.sortedIndices.length > 0;
        const phase = meta.phase;
        const boundIdx = meta.boundIndex ?? idxA;
        const prevBound = meta.previousBound ?? 0;
        const lowVal = meta.low ?? prevBound;
        const midVal = meta.mid ?? idxA;
        const highVal = meta.high ?? boundIdx;

        if (isMatch) {
          return {
            title: `Hedef Bulundu! İndeks ${idxA} (${valA})`,
            description: `Eleman arr[${idxA}] = ${valA} ile aranan hedef ${valB} eşleşti! Hedef bulundu.`,
            formula: `${valA} = ${valB} (EŞLEŞTİ)`,
          };
        }

        if (phase === 'BOUND') {
          if (idxA === 0) {
            return {
              title: `Exponential Search: İlk Eleman Kontrolü (İndeks 0)`,
              description: `Arama 0. indeksten başlıyor. arr[0] = ${valA} değeri hedef ${valB} ile karşılaştırılıyor.`,
              formula: `${valA} ≠ ${valB} → Sınır Aşamasına Geç`,
            };
          }
          if (valA < valB) {
            return {
              title: `Exponential Search: Sınır Genişletiliyor (İndeks ${boundIdx})`,
              description: `Kontrol edilen eleman ${valA} < hedef ${valB} olduğu için arama sınırı 2 katına çıkarılıyor (Sonraki Sınır: ${boundIdx * 2}).`,
              formula: `${valA} < ${valB} → Sınır: ${boundIdx}`,
            };
          }
          return {
            title: `Exponential Search: Hedef Aralığı Tespit Edildi ([${prevBound}..${boundIdx}])`,
            description: `Kontrol edilen eleman ${valA} ≥ hedef ${valB} olduğu için hedef [${prevBound}..${boundIdx}] aralığında olabilir. İkili aramaya geçiliyor.`,
            formula: `${valA} ≥ ${valB} → Aralık: [${prevBound}..${boundIdx}]`,
          };
        }

        if (valA < valB) {
          return {
            title: `Exponential Search (Binary): Mid İndeks ${midVal} (${valA}) vs Hedef (${valB})`,
            description: `[${lowVal}..${highVal}] aralığında orta eleman ${valA} < hedef ${valB} olduğu için sol taraf elendi. Yeni aralık: [${midVal + 1}..${highVal}].`,
            formula: `${valA} < ${valB} → low = ${midVal + 1}`,
          };
        }
        return {
          title: `Exponential Search (Binary): Mid İndeks ${midVal} (${valA}) vs Hedef (${valB})`,
          description: `[${lowVal}..${highVal}] aralığında orta eleman ${valA} > hedef ${valB} olduğu için sağ taraf elendi. Yeni aralık: [${lowVal}..${midVal - 1}].`,
          formula: `${valA} > ${valB} → high = ${midVal - 1}`,
        };
      }

      case 'interpolation-search': {
        const isMatch = event.sortedIndices.length > 0;
        const lowVal = meta.low ?? 0;
        const probeVal = meta.probe ?? idxA;
        const highVal = meta.high ?? 0;

        if (isMatch) {
          return {
            title: `Hedef Bulundu! Tahmin İndeksi ${probeVal} (${valA})`,
            description: `Tahmin edilen konumdaki eleman arr[${probeVal}] = ${valA} ile aranan hedef ${valB} birebir eşleşti!`,
            formula: `${valA} = ${valB} (EŞLEŞTİ)`,
          };
        }

        if (valA < valB) {
          return {
            title: `Interpolation Search: Tahmin İndeksi ${probeVal} (${valA}) vs Hedef (${valB})`,
            description: `[${lowVal}..${highVal}] aralığında tahmin edilen değer ${valA} < aranan hedef ${valB} olduğu için hedefin sağda olduğu belirlendi. Sol taraf elendi. Yeni aralık: [${probeVal + 1}..${highVal}].`,
            formula: `${valA} < ${valB} → low = ${probeVal + 1}`,
          };
        }
        return {
          title: `Interpolation Search: Tahmin İndeksi ${probeVal} (${valA}) vs Hedef (${valB})`,
          description: `[${lowVal}..${highVal}] aralığında tahmin edilen değer ${valA} > aranan hedef ${valB} olduğu için hedefin solda olduğu belirlendi. Sağ taraf elendi. Yeni aralık: [${lowVal}..${probeVal - 1}].`,
          formula: `${valA} > ${valB} → high = ${probeVal - 1}`,
        };
      }

      case 'jump-search': {
        const isMatch = event.sortedIndices.length > 0;
        const phase = meta.phase;
        const blockSize = meta.blockSize ?? 1;
        const bStart = meta.blockStart ?? 0;
        const bEnd = meta.blockEnd ?? 0;

        if (isMatch) {
          return {
            title: `Hedef Bulundu! İndeks ${idxA} (${valA})`,
            description: `Eleman arr[${idxA}] = ${valA} ile aranan hedef ${valB} eşleşti! Hedef bulundu.`,
            formula: `${valA} = ${valB} (EŞLEŞTİ)`,
          };
        }

        if (phase === 'jump') {
          if (valA < valB) {
            return {
              title: `Jump Search: Sıçrama İndeksi ${idxA} (${valA}) vs Hedef (${valB})`,
              description: `Blok sonundaki ${valA} < hedef ${valB} olduğu için bir sonraki bloğa sıçranıyor (Blok Boyutu: ${blockSize}).`,
              formula: `${valA} < ${valB} → İleri Sıçra`,
            };
          }
          return {
            title: `Jump Search: Hedef Blok Tespit Edildi (İndeks ${idxA})`,
            description: `Blok sonundaki ${valA} ≥ hedef ${valB} olduğu için hedef [${bStart}..${bEnd}] bloğunda olabilir. Blok içi aramaya geçiliyor.`,
            formula: `${valA} ≥ ${valB} → Blok: [${bStart}..${bEnd}]`,
          };
        }

        return {
          title: `Jump Search: Blok İçi Tarama (İndeks ${idxA}) vs Hedef (${valB})`,
          description: `[${bStart}..${bEnd}] bloğu içerisinde İndeks ${idxA} (${valA}) ile hedef ${valB} karşılaştırılıyor.`,
          formula: `${valA} ≠ ${valB}`,
        };
      }

      case 'binary-search': {
        const isMatch = event.sortedIndices.length > 0;
        const lowVal = meta.low ?? 0;
        const midVal = meta.mid ?? idxA;
        const highVal = meta.high ?? 0;

        if (isMatch) {
          return {
            title: `Hedef Bulundu! Mid İndeks ${midVal} (${valA})`,
            description: `Ortadaki eleman arr[${midVal}] = ${valA} ile aranan hedef ${valB} eşleşti! Hedef bulundu.`,
            formula: `${valA} = ${valB} (EŞLEŞTİ)`,
          };
        }
        if (valA < valB) {
          return {
            title: `Binary Search: Mid İndeks ${midVal} (${valA}) vs Hedef (${valB})`,
            description: `Ortadaki eleman ${valA} < aranan hedef ${valB} olduğu için sol taraf ([${lowVal}..${midVal}]) elendi. Yeni aralık: [${midVal + 1}..${highVal}].`,
            formula: `${valA} < ${valB} → low = ${midVal + 1}`,
          };
        }
        return {
          title: `Binary Search: Mid İndeks ${midVal} (${valA}) vs Hedef (${valB})`,
          description: `Ortadaki eleman ${valA} > aranan hedef ${valB} olduğu için sağ taraf ([${midVal}..${highVal}]) elendi. Yeni aralık: [${lowVal}..${midVal - 1}].`,
          formula: `${valA} > ${valB} → high = ${midVal - 1}`,
        };
      }

      case 'linear-search':
        break;
    }
  }

  // Linear search veya tek indeksli arama adımları
  const isMatch = event.sortedIndices.length > 0;
  if (isMatch) {
    return {
      title: `Hedef Bulundu! İndeks ${idxA} (${valA})`,
      description: `${valA} değeri aranan ${valB} değeri ile eşleşti! Hedef bulundu.`,
      formula: `${valA} = ${valB} (EŞLEŞTİ)`,
    };
  }
  return {
    title: `Karşılaştırma: İndeks ${idxA} (${valA}) vs Hedef (${valB})`,
    description: `${valA} değeri, aranan ${valB} değeri ile karşılaştırılıyor.`,
    formula: `${valA} ≠ ${valB}`,
  };
}
