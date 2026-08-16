import { describe, it, expect } from 'vitest';
import {
  generateStepExplanation,
  enrichSimulationEvents,
} from '../../core/explanations/explanationEngine';
import type { SimulationEvent } from '../../types/event';

describe('Explanation Engine Unit Tests', () => {
  const baseStats = { comparisons: 0, swaps: 0, pass: 1 };

  describe('COMPARE Event', () => {
    it('Büyük olma durumunda doğru title, description ve formula üretmeli', () => {
      const event: SimulationEvent = {
        stepIndex: 1,
        totalSteps: 10,
        type: 'COMPARE',
        indices: [0, 1],
        values: [8, 3],
        arraySnapshot: [8, 3, 5],
        sortedIndices: [],
        stats: baseStats,
      };

      const result = generateStepExplanation(event);

      expect(result.title).toContain('İndeks 0 (8) vs İndeks 1 (3)');
      expect(result.description).toContain('İndeks 0 (8) ile İndeks 1 (3) karşılaştırılıyor');
      expect(result.formula).toBe('8 > 3');
    });

    it('Küçük veya eşit olma durumunda doğru formula üretmeli', () => {
      const event: SimulationEvent = {
        stepIndex: 2,
        totalSteps: 10,
        type: 'COMPARE',
        indices: [0, 1],
        values: [3, 8],
        arraySnapshot: [3, 8, 5],
        sortedIndices: [],
        stats: baseStats,
      };

      const result = generateStepExplanation(event);
      expect(result.formula).toBe('3 ≤ 8');
    });

    it('Negatif ve sıfır değerleri doğru işlemeli', () => {
      const event: SimulationEvent = {
        stepIndex: 3,
        totalSteps: 10,
        type: 'COMPARE',
        indices: [0, 1],
        values: [-5, 0],
        arraySnapshot: [-5, 0],
        sortedIndices: [],
        stats: baseStats,
      };

      const result = generateStepExplanation(event);
      expect(result.title).toContain('İndeks 0 (-5) vs İndeks 1 (0)');
      expect(result.formula).toBe('-5 ≤ 0');
    });
  });

  describe('SWAP Event', () => {
    it('Yer değiştirilen elemanları doğru metinle açıklamalı', () => {
      const event: SimulationEvent = {
        stepIndex: 4,
        totalSteps: 10,
        type: 'SWAP',
        indices: [0, 1],
        values: [3, 8], // Swap sonrası yeni dizilim: İndeks 0 = 3, İndeks 1 = 8
        arraySnapshot: [3, 8, 5],
        sortedIndices: [],
        stats: { comparisons: 1, swaps: 1, pass: 1 },
      };

      const result = generateStepExplanation(event);

      expect(result.title).toContain('Yer Değiştirme (Swap): 8 ↔ 3');
      expect(result.description).toContain('8 > 3 olduğu için iki eleman yer değiştiriyor');
      expect(result.formula).toBe('[8, 3] → [3, 8]');
    });
  });

  describe('OVERWRITE Event', () => {
    it('Hedef indekse yazılan değeri doğru açıklamalı', () => {
      const event: SimulationEvent = {
        stepIndex: 5,
        totalSteps: 10,
        type: 'OVERWRITE',
        indices: [2],
        values: [7],
        arraySnapshot: [1, 3, 7],
        sortedIndices: [],
        stats: baseStats,
      };

      const result = generateStepExplanation(event);

      expect(result.title).toBe('Eleman Yazımı (Overwrite): İndeks 2');
      expect(result.description).toContain('Değer 7 (İndeks 2) hedef konuma yerleştirildi.');
      expect(result.formula).toBe('arr[2] = 7');
    });
  });

  describe('SELECT_MIN Event', () => {
    it('Tur başlangıcı için en küçük arama metni üretmeli', () => {
      const event: SimulationEvent = {
        stepIndex: 1,
        totalSteps: 10,
        type: 'SELECT_MIN',
        indices: [0],
        values: [9],
        arraySnapshot: [9, 4, 2],
        sortedIndices: [],
        stats: { comparisons: 0, swaps: 0, pass: 1 },
      };

      const result = generateStepExplanation(event);

      expect(result.title).toContain('1. Tur: İndeks 0 İçin En Küçük Değer Aranıyor');
      expect(result.description).toContain('Başlangıç olarak 9 değerini en küçük varsayıyoruz.');
    });

    it('Yeni minimum aday bulunduğunda (meta.isMinCandidate = true) özel açıklama üretmeli', () => {
      const event: SimulationEvent = {
        stepIndex: 3,
        totalSteps: 10,
        type: 'SELECT_MIN',
        indices: [2],
        values: [2],
        arraySnapshot: [9, 4, 2],
        sortedIndices: [],
        stats: { comparisons: 2, swaps: 0, pass: 1 },
        meta: { kind: 'selection-sort', isMinCandidate: true },
      };

      const result = generateStepExplanation(event);

      expect(result.title).toBe('Yeni En Küçük Bulundu: 2');
      expect(result.description).toContain('Yeni en küçük sayı İndeks 2\'deki 2 oldu.');
    });
  });

  describe('INSERT Event', () => {
    it('Anahtar eleman seçildiğinde (meta.isKeySelected = true) açıklama üretmeli', () => {
      const event: SimulationEvent = {
        stepIndex: 1,
        totalSteps: 10,
        type: 'INSERT',
        indices: [1],
        values: [4],
        arraySnapshot: [9, 4, 2],
        sortedIndices: [0],
        stats: baseStats,
        meta: { kind: 'insertion-sort', isKeySelected: true },
      };

      const result = generateStepExplanation(event);

      expect(result.title).toBe('Anahtar Eleman Seçildi: 4 (İndeks 1)');
      expect(result.description).toContain('Elimize 4 sayısını aldık.');
    });

    it('Anahtar eleman yerleştiğinde varsayılan yerleştirme metni üretmeli', () => {
      const event: SimulationEvent = {
        stepIndex: 4,
        totalSteps: 10,
        type: 'INSERT',
        indices: [0],
        values: [4],
        arraySnapshot: [4, 9, 2],
        sortedIndices: [0, 1],
        stats: baseStats,
      };

      const result = generateStepExplanation(event);

      expect(result.title).toBe('Anahtar Eleman Yerleştirildi: 4');
      expect(result.description).toContain('Elimizdeki 4 sayısı İndeks 0 pozisyonundaki boşluğa başarıyla yerleştirildi.');
    });
  });

  describe('PIVOT_SELECT Event', () => {
    it('Pivot eleman ve subArrayRange verisini açıklamaya dönüştürmeli', () => {
      const event: SimulationEvent = {
        stepIndex: 1,
        totalSteps: 10,
        type: 'PIVOT_SELECT',
        indices: [4],
        values: [6],
        arraySnapshot: [3, 8, 2, 5, 6],
        sortedIndices: [],
        pivotIndex: 4,
        subArrayRange: [0, 4],
        stats: baseStats,
      };

      const result = generateStepExplanation(event);

      expect(result.title).toBe('Pivot Eleman Seçildi: 6 (İndeks 4)');
      expect(result.description).toContain('[0..4] aralığı için hedef referans sayımız (Pivot) 6 olarak belirlendi.');
    });

    it('subArrayRange olmadığında da hata vermemeli', () => {
      const event: SimulationEvent = {
        stepIndex: 1,
        totalSteps: 10,
        type: 'PIVOT_SELECT',
        indices: [2],
        values: [5],
        arraySnapshot: [1, 2, 5],
        sortedIndices: [],
        stats: baseStats,
      };

      const result = generateStepExplanation(event);

      expect(result.title).toBe('Pivot Eleman Seçildi: 5 (İndeks 2)');
      expect(result.description).toBeDefined();
    });
  });

  describe('PARTITION_COMPLETE Event', () => {
    it('Partition tamamlandığında pivot sabitlenme metnini üretmeli', () => {
      const event: SimulationEvent = {
        stepIndex: 5,
        totalSteps: 10,
        type: 'PARTITION_COMPLETE',
        indices: [2, 4],
        values: [6, 8],
        arraySnapshot: [3, 2, 6, 5, 8],
        sortedIndices: [2],
        pivotIndex: 2,
        subArrayRange: [0, 4],
        stats: { comparisons: 4, swaps: 2, pass: 1 },
      };

      const result = generateStepExplanation(event);

      expect(result.title).toBe('Partition Tamamlandı: Pivot (6) Doğru Yerinde!');
      expect(result.description).toContain('Pivot sayımız 6 tam olması gereken konuma (İndeks 2) sabitlendi.');
    });
  });

  describe('SPLIT & MERGE Events', () => {
    it('SPLIT etkinliği için alt dizi aralığını metne dönüştürmeli', () => {
      const event: SimulationEvent = {
        stepIndex: 1,
        totalSteps: 10,
        type: 'SPLIT',
        indices: [0, 1, 2, 3],
        values: [8, 3, 5, 1],
        arraySnapshot: [8, 3, 5, 1],
        sortedIndices: [],
        subArrayRange: [0, 3],
        stats: baseStats,
      };

      const result = generateStepExplanation(event);

      expect(result.title).toBe('Dizi İkiye Bölünüyor (Split)');
      expect(result.description).toContain('[0..3] indeksleri arasındaki parça ortadan ikiye bölünüyor');
    });

    it('MERGE etkinliği için alt dizi birleştirme metni üretmeli', () => {
      const event: SimulationEvent = {
        stepIndex: 6,
        totalSteps: 10,
        type: 'MERGE',
        indices: [0, 1, 2, 3],
        values: [3, 8, 1, 5],
        arraySnapshot: [3, 8, 1, 5],
        sortedIndices: [],
        subArrayRange: [0, 3],
        stats: baseStats,
      };

      const result = generateStepExplanation(event);

      expect(result.title).toBe('İki Sıralı Parça Birleştiriliyor (Merge)');
      expect(result.description).toContain('[0..3] aralığındaki sol ve sağ sıralı gruplar');
    });
  });

  describe('PASS_COMPLETE Event', () => {
    it('Tur tamamlandığında kilitlenen elemanı doğru bildirmeli', () => {
      const event: SimulationEvent = {
        stepIndex: 8,
        totalSteps: 10,
        type: 'PASS_COMPLETE',
        indices: [4],
        values: [9],
        arraySnapshot: [3, 1, 5, 2, 9],
        sortedIndices: [4],
        stats: { comparisons: 4, swaps: 2, pass: 1 },
      };

      const result = generateStepExplanation(event);

      expect(result.title).toBe('1. Tur Tamamlandı');
      expect(result.description).toContain('Bu turun en büyük sayısı olan 9 (İndeks 4) doğru yerine yerleşti');
    });
  });

  describe('COMPLETE Event', () => {
    it('Sıralama bittiğinde toplam istatistikleri sunmalı', () => {
      const event: SimulationEvent = {
        stepIndex: 10,
        totalSteps: 10,
        type: 'COMPLETE',
        indices: [],
        values: [],
        arraySnapshot: [1, 2, 3, 5, 9],
        sortedIndices: [0, 1, 2, 3, 4],
        stats: { comparisons: 10, swaps: 4, pass: 4 },
      };

      const result = generateStepExplanation(event);

      expect(result.title).toBe('Sıralama Başarıyla Tamamlandı!');
      expect(result.description).toContain('Toplam 10 karşılaştırma ve 4 yer değiştirme yapıldı.');
    });
  });

  describe('Fallback & Unknown Event Handling', () => {
    it('Bilinmeyen veya desteklenmeyen event durumunda varsayılan jenerik metin üretmeli', () => {
      const event = {
        stepIndex: 5,
        totalSteps: 10,
        type: 'UNKNOWN_CUSTOM_EVENT' as any,
        indices: [],
        values: [],
        arraySnapshot: [1, 2],
        sortedIndices: [],
        stats: baseStats,
      };

      const result = generateStepExplanation(event);

      expect(result.title).toBe('Adım 5');
      expect(result.description).toBe('İşlem gerçekleştiriliyor...');
    });
  });

  describe('enrichSimulationEvents Function', () => {
    it('Ham SimulationEvent[] dizisini alır ve her adımı StepExplanation ile zenginleştirir', () => {
      const events: SimulationEvent[] = [
        {
          stepIndex: 1,
          totalSteps: 2,
          type: 'COMPARE',
          indices: [0, 1],
          values: [5, 2],
          arraySnapshot: [5, 2],
          sortedIndices: [],
          stats: baseStats,
        },
        {
          stepIndex: 2,
          totalSteps: 2,
          type: 'COMPLETE',
          indices: [],
          values: [],
          arraySnapshot: [2, 5],
          sortedIndices: [0, 1],
          stats: { comparisons: 1, swaps: 1, pass: 1 },
        },
      ];

      const enriched = enrichSimulationEvents(events);

      expect(enriched).toHaveLength(2);
      expect(enriched[0].title).toBeDefined();
      expect(enriched[0].description).toBeDefined();
      expect(enriched[0].formula).toBe('5 > 2');
      expect(enriched[1].title).toBe('Sıralama Başarıyla Tamamlandı!');
    });
  });
});
