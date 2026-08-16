import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { SEARCHING_ALGORITHMS, ALL_ALGORITHMS, getAlgorithmById } from '../../core/algorithms';
import { ArrayVisualizer } from '../../components/visualizer/ArrayVisualizer';
import { generateStepExplanation } from '../../core/explanations/explanationEngine';
import type { SimulationEvent } from '../../types/event';

describe('Binary Search Integration & UI Mapping Tests', () => {
  const initialArray = [85, 12, 43, 99, 27, 60];
  const sortedArray = [12, 27, 43, 60, 85, 99];

  it('1. Binary Search registry sisteminde ve SEARCHING_ALGORITHMS içinde bulunmalı', () => {
    expect(SEARCHING_ALGORITHMS['binary-search']).toBeDefined();
    expect(ALL_ALGORITHMS.find((a) => a.metadata.id === 'binary-search')).toBeDefined();

    const algo = getAlgorithmById('binary-search');
    expect(algo).toBeDefined();
    expect(algo?.metadata.name).toContain('Binary Search');
    expect(algo?.metadata.category).toBe('searching');
  });

  it('2. Binary Search adımlarında visualizer kartları altında L, M, H pointer rozetleri basılmalı', () => {
    const mockBinaryStep: SimulationEvent & { title?: string; description?: string } = {
      stepIndex: 1,
      totalSteps: 3,
      type: 'COMPARE',
      indices: [2],
      values: [43, 60],
      arraySnapshot: sortedArray,
      sortedIndices: [],
      stats: { pass: 1, comparisons: 1, swaps: 0 },
      meta: {
        kind: 'binary-search',
        low: 0,
        mid: 2,
        high: 5,
      },
    };

    render(
      <ArrayVisualizer step={mockBinaryStep as any} initialArray={initialArray} />
    );

    expect(screen.getByText('ALT')).toBeDefined();
    expect(screen.getByText('ORTA')).toBeDefined();
    expect(screen.getByText('ÜST')).toBeDefined();
    expect(screen.getByText(/Aktif Arama Aralığı/)).toBeDefined();
  });

  it('3. Binary Search adımlarında elenen elemanlara card-visited uygulanmalı', () => {
    const mockBinaryStep: SimulationEvent = {
      stepIndex: 2,
      totalSteps: 3,
      type: 'COMPARE',
      indices: [4],
      values: [85, 60],
      arraySnapshot: sortedArray,
      sortedIndices: [],
      stats: { pass: 1, comparisons: 2, swaps: 0 },
      meta: {
        kind: 'binary-search',
        low: 3,
        mid: 4,
        high: 5,
      },
    };

    const { container } = render(
      <ArrayVisualizer step={mockBinaryStep as any} initialArray={initialArray} />
    );

    const cards = container.querySelectorAll('.search-card');
    expect(cards).toHaveLength(6);
    // Index 0, 1, 2 low < 3 olduğu için elenmiş (card-visited) olmalı
    expect(cards[0].classList.contains('card-visited')).toBe(true);
    expect(cards[1].classList.contains('card-visited')).toBe(true);
    expect(cards[2].classList.contains('card-visited')).toBe(true);
    // Mid (index 4) card-active olmalı
    expect(cards[4].classList.contains('card-active')).toBe(true);
  });

  it('4. Explanation engine Binary Search özel adım açıklaması üretmeli', () => {
    const event: SimulationEvent = {
      stepIndex: 1,
      totalSteps: 3,
      type: 'COMPARE',
      indices: [2],
      values: [43, 60],
      arraySnapshot: sortedArray,
      sortedIndices: [],
      stats: { pass: 1, comparisons: 1, swaps: 0 },
      meta: {
        kind: 'binary-search',
        low: 0,
        mid: 2,
        high: 5,
      },
    };

    const exp = generateStepExplanation(event);
    expect(exp.title).toContain('Binary Search');
    expect(exp.description).toContain('sol taraf');
    expect(exp.formula).toContain('low = 3');
  });

  it('5. Binary Search tamamlandığında Arama Başarıyla Tamamlandı metni üretilmeli', () => {
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
        kind: 'binary-search',
        low: 3,
        mid: 3,
        high: 3,
      },
    };

    const exp = generateStepExplanation(event);
    expect(exp.title).toBe('Arama Başarıyla Tamamlandı!');
    expect(exp.description).toContain('İndeks 3');
  });
});
