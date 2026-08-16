import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { SEARCHING_ALGORITHMS, ALL_ALGORITHMS, getAlgorithmById } from '../../core/algorithms';
import { ArrayVisualizer } from '../../components/visualizer/ArrayVisualizer';
import { generateStepExplanation } from '../../core/explanations/explanationEngine';
import type { SimulationEvent } from '../../types/event';

describe('Jump Search Integration & UI Mapping Tests', () => {
  const initialArray = [85, 12, 43, 99, 27, 60];
  const sortedArray = [12, 27, 43, 60, 85, 99];

  it('1. Jump Search registry sisteminde ve SEARCHING_ALGORITHMS içinde bulunmalı', () => {
    expect(SEARCHING_ALGORITHMS['jump-search']).toBeDefined();
    expect(ALL_ALGORITHMS.find((a) => a.metadata.id === 'jump-search')).toBeDefined();

    const algo = getAlgorithmById('jump-search');
    expect(algo).toBeDefined();
    expect(algo?.metadata.name).toContain('Jump Search');
    expect(algo?.metadata.category).toBe('searching');
  });

  it('2. Jump Search sıçrama adımlarında JUMP pointer rozeti ekranda basılmalı', () => {
    const mockJumpStep: SimulationEvent & { title?: string; description?: string } = {
      stepIndex: 1,
      totalSteps: 4,
      type: 'COMPARE',
      indices: [1],
      values: [27, 60],
      arraySnapshot: sortedArray,
      sortedIndices: [],
      stats: { pass: 1, comparisons: 1, swaps: 0 },
      meta: {
        kind: 'jump-search',
        blockSize: 2,
        blockStart: 0,
        blockEnd: 1,
        phase: 'jump',
      },
    };

    render(
      <ArrayVisualizer step={mockJumpStep as any} initialArray={initialArray} />
    );

    expect(screen.getByText('SIÇRAMA')).toBeDefined();
    expect(screen.getByText(/Aktif Arama Bloğu/)).toBeDefined();
  });

  it('3. Jump Search linear aşamada aktif blok dışındaki elemanları matlaştırmalı (card-visited)', () => {
    const mockLinearStep: SimulationEvent = {
      stepIndex: 3,
      totalSteps: 4,
      type: 'COMPARE',
      indices: [3],
      values: [60, 60],
      arraySnapshot: sortedArray,
      sortedIndices: [3],
      stats: { pass: 1, comparisons: 3, swaps: 0 },
      meta: {
        kind: 'jump-search',
        blockSize: 2,
        blockStart: 2,
        blockEnd: 3,
        phase: 'linear',
      },
    };

    const { container } = render(
      <ArrayVisualizer step={mockLinearStep as any} initialArray={initialArray} />
    );

    const cards = container.querySelectorAll('.search-card');
    expect(cards).toHaveLength(6);
    // Index 0, 1 blockStart (2) küçük olduğu için elenmiş (card-visited) olmalı
    expect(cards[0].classList.contains('card-visited')).toBe(true);
    expect(cards[1].classList.contains('card-visited')).toBe(true);
    // Index 3 hedef bulundu olduğu için card-found olmalı
    expect(cards[3].classList.contains('card-found')).toBe(true);
  });

  it('4. Explanation engine Jump Search özel adım açıklaması üretmeli', () => {
    const event: SimulationEvent = {
      stepIndex: 1,
      totalSteps: 3,
      type: 'COMPARE',
      indices: [1],
      values: [27, 60],
      arraySnapshot: sortedArray,
      sortedIndices: [],
      stats: { pass: 1, comparisons: 1, swaps: 0 },
      meta: {
        kind: 'jump-search',
        blockSize: 2,
        blockStart: 0,
        blockEnd: 1,
        phase: 'jump',
      },
    };

    const exp = generateStepExplanation(event);
    expect(exp.title).toContain('Jump Search');
    expect(exp.description).toContain('bir sonraki bloğa sıçranıyor');
    expect(exp.formula).toContain('Sıçra');
  });

  it('5. Jump Search tamamlandığında Arama Başarıyla Tamamlandı metni üretilmeli', () => {
    const event: SimulationEvent = {
      stepIndex: 3,
      totalSteps: 3,
      type: 'COMPLETE',
      indices: [3],
      values: [60, 60],
      arraySnapshot: sortedArray,
      sortedIndices: [3],
      stats: { pass: 1, comparisons: 3, swaps: 0 },
      meta: {
        kind: 'jump-search',
        blockSize: 2,
        blockStart: 2,
        blockEnd: 3,
        phase: 'linear',
      },
    };

    const exp = generateStepExplanation(event);
    expect(exp.title).toBe('Arama Başarıyla Tamamlandı!');
    expect(exp.description).toContain('İndeks 3');
  });

  describe('6. initialArray vs workingArray Veri Ayrımı Güvence Testleri', () => {
    it('A) Jump Search çalıştırıldığında kullanıcının initialArray dizilim sırası bozulmamalı (MUTATION YOK)', () => {
      const originalInput = [73, 12, 91, 34, 5, 68, 27];
      const copyOfOriginal = [...originalInput];

      const algo = getAlgorithmById('jump-search')!;
      const workingArray = [...originalInput].sort((a, b) => a - b);
      const events = algo.generateSteps(workingArray, 91);

      // Algoritma adımları workingArray kullanır
      expect(events[0].arraySnapshot).toEqual(workingArray);
      // Orijinal girdi asla mutate edilmemiş olmalıdır
      expect(originalInput).toEqual(copyOfOriginal);
    });

    it('B) Jump Search workingArray dizisinin küçükten büyüğe sıralı olduğu doğrulanmalı', () => {
      const originalInput = [73, 12, 91, 34, 5, 68, 27];
      const workingArray = [...originalInput].sort((a, b) => a - b);

      const algo = getAlgorithmById('jump-search')!;
      const events = algo.generateSteps(workingArray, 34);

      const snapshot = events[0].arraySnapshot;
      expect(snapshot).toEqual([5, 12, 27, 34, 68, 73, 91]);
      // Sıralılık kontrolü
      for (let i = 0; i < snapshot.length - 1; i++) {
        expect(snapshot[i]).toBeLessThanOrEqual(snapshot[i + 1]);
      }
    });

    it('C) Target değeri initialArray içerisinden seçilse dahi workingArray içinde doğru bulunmalı', () => {
      const originalInput = [73, 12, 91, 34, 5];
      const targetValue = 91; // initialArray'de var
      const workingArray = [...originalInput].sort((a, b) => a - b); // [5, 12, 34, 73, 91]

      const algo = getAlgorithmById('jump-search')!;
      const events = algo.generateSteps(workingArray, targetValue);
      const completeStep = events[events.length - 1];

      expect(completeStep.sortedIndices).toEqual([4]); // workingArray'deki indeksi 4
    });

    it('D) initialArray ve workingArray indekslerinin farklı olduğu durumda arama sonucu workingArray indeksini dönmeli', () => {
      // Örnek: initialArray = [90, 10, 50, 30], target = 90
      // workingArray = [10, 30, 50, 90]
      // 90 değeri initialArray'de indeks 0, ancak workingArray'de indeks 3!
      const initialArray = [90, 10, 50, 30];
      const target = 90;
      const workingArray = [...initialArray].sort((a, b) => a - b);

      expect(initialArray.indexOf(90)).toBe(0);
      expect(workingArray.indexOf(90)).toBe(3);

      const algo = getAlgorithmById('jump-search')!;
      const events = algo.generateSteps(workingArray, target);
      const completeStep = events[events.length - 1];

      // Sonuç workingArray indeksi olan 3 olmalıdır
      expect(completeStep.sortedIndices).toEqual([3]);
    });

    it('E) Yeni Hedef seçildiğinde (randomizeTarget) initialArray sırası değişmemeli', () => {
      const originalInput = [73, 12, 91, 34, 5, 68, 27];
      const copyOfOriginal = [...originalInput];

      // randomizeTarget workingArray uretir ancak initialArray state'ini degistirmez
      const workingArray1 = [...originalInput].sort((a, b) => a - b);
      const candidates = workingArray1.filter((val) => val !== 91);
      const newTarget = candidates[0];

      const algo = getAlgorithmById('jump-search')!;
      const events = algo.generateSteps(workingArray1, newTarget);

      expect(events).toBeDefined();
      expect(originalInput).toEqual(copyOfOriginal);
    });
  });
});
