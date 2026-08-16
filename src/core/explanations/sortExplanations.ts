import type { SimulationEvent, StepExplanation } from '../../types/event';

/**
 * Sıralama algoritmalarına (Bubble, Selection, Insertion, Merge, Quick) ve
 * genel/bilinmeyen olaylara özel adım açıklamalarını (StepExplanation) üreten modül.
 */
export function explainSortStep(event: SimulationEvent): StepExplanation {
  const { type, indices, values, stats, pivotIndex, subArrayRange, meta } = event;
  const valA = values[0];
  const valB = values[1];
  const idxA = indices[0];
  const idxB = indices[1];

  switch (type) {
    case 'COMPARE': {
      if (indices.length === 1) {
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
      const isGreater = valA > valB;
      return {
        title: `Karşılaştırma: İndeks ${idxA} (${valA}) vs İndeks ${idxB} (${valB})`,
        description: `İndeks ${idxA} (${valA}) ile İndeks ${idxB} (${valB}) karşılaştırılıyor. Soldaki değer sağdakinden küçük olmalıdır.`,
        formula: `${valA} ${isGreater ? '>' : '≤'} ${valB}`,
      };
    }
    case 'SWAP': {
      return {
        title: `Yer Değiştirme (Swap): ${valB} ↔ ${valA}`,
        description: `${valB} > ${valA} olduğu için iki eleman yer değiştiriyor. ${valB} sağa, ${valA} sola kayıyor.`,
        formula: `[${valB}, ${valA}] → [${valA}, ${valB}]`,
      };
    }
    case 'OVERWRITE': {
      return {
        title: `Eleman Yazımı (Overwrite): İndeks ${idxA}`,
        description: `Değer ${valA} (İndeks ${idxA}) hedef konuma yerleştirildi.`,
        formula: `arr[${idxA}] = ${valA}`,
      };
    }
    case 'SELECT_MIN': {
      if (meta?.kind === 'selection-sort' && meta.isMinCandidate) {
        return {
          title: `Yeni En Küçük Bulundu: ${valA}`,
          description: `${valA} sayısı mevcut en küçük sayımızdan daha küçük! Yeni en küçük sayı İndeks ${idxA}'deki ${valA} oldu.`,
        };
      }
      return {
        title: `${stats.pass}. Tur: İndeks ${idxA} İçin En Küçük Değer Aranıyor`,
        description: `Hedefimiz İndeks ${idxA} konumuna gelecek en küçük sayıyı bulmak. Başlangıç olarak ${valA} değerini en küçük varsayıyoruz.`,
      };
    }
    case 'INSERT': {
      if (meta?.kind === 'insertion-sort' && meta.isKeySelected) {
        return {
          title: `Anahtar Eleman Seçildi: ${valA} (İndeks ${idxA})`,
          description: `Elimize ${valA} sayısını aldık. Şimdi bu sayıyı sol tarafımızda duran sıralı sayıların arasında uygun boşluğa sokacağız.`,
        };
      }
      return {
        title: `Anahtar Eleman Yerleştirildi: ${valA}`,
        description: `Uygun konum bulundu! Elimizdeki ${valA} sayısı İndeks ${idxA} pozisyonundaki boşluğa başarıyla yerleştirildi.`,
      };
    }
    case 'PIVOT_SELECT': {
      const pIdx = pivotIndex ?? idxA;
      return {
        title: `Pivot Eleman Seçildi: ${valA} (İndeks ${pIdx})`,
        description: `[${subArrayRange ? subArrayRange.join('..') : ''}] aralığı için hedef referans sayımız (Pivot) ${valA} olarak belirlendi. Hedefimiz: ${valA}'den küçükleri sola, büyükleri sağa toplamak.`,
      };
    }
    case 'PARTITION_COMPLETE': {
      const pIdx = pivotIndex ?? idxA;
      return {
        title: `Partition Tamamlandı: Pivot (${valA}) Doğru Yerinde!`,
        description: `Pivot sayımız ${valA} tam olması gereken konuma (İndeks ${pIdx}) sabitlendi. Artık solundaki sayılar ≤ ${valA}, sağındaki sayılar ≥ ${valA}.`,
      };
    }
    case 'SPLIT': {
      const rangeText = subArrayRange ? `[${subArrayRange[0]}..${subArrayRange[1]}]` : '';
      return {
        title: `Dizi İkiye Bölünüyor (Split)`,
        description: `${rangeText} indeksleri arasındaki parça ortadan ikiye bölünüyor ve alt dizilere ayrılıyor.`,
      };
    }
    case 'MERGE': {
      const rangeText = subArrayRange ? `[${subArrayRange[0]}..${subArrayRange[1]}]` : '';
      return {
        title: `İki Sıralı Parça Birleştiriliyor (Merge)`,
        description: `${rangeText} aralığındaki sol ve sağ sıralı gruplar karşılaştırılarak birleştiriliyor.`,
      };
    }
    case 'PASS_COMPLETE': {
      const targetIdx = indices[0];
      const targetVal = values[0];
      return {
        title: `${stats.pass}. Tur Tamamlandı`,
        description: `Bu turun en büyük sayısı olan ${targetVal} (İndeks ${targetIdx}) doğru yerine yerleşti ve kilitlendi.`,
      };
    }
    case 'COMPLETE': {
      return {
        title: 'Sıralama Başarıyla Tamamlandı!',
        description: `Tüm sayılar küçükten büyüğe sıralandı! Toplam ${stats.comparisons} karşılaştırma ve ${stats.swaps} yer değiştirme yapıldı.`,
      };
    }
    default: {
      return {
        title: `Adım ${event.stepIndex}`,
        description: `İşlem gerçekleştiriliyor...`,
      };
    }
  }
}
