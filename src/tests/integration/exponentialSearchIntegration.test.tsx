import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { SEARCHING_ALGORITHMS, ALL_ALGORITHMS, getAlgorithmById, SORTING_ALGORITHMS } from '../../core/algorithms';
import { ArrayVisualizer } from '../../components/visualizer/ArrayVisualizer';
import { generateStepExplanation } from '../../core/explanations/explanationEngine';
import type { SimulationEvent } from '../../types/event';

describe('Exponential Search Integration & UI Mapping Tests', () => {
  const initialArray = [85, 12, 43, 99, 27, 60];
  const sortedArray = [12, 27, 43, 60, 85, 99];

  it('1. Exponential Search registry sisteminde ve SEARCHING_ALGORITHMS içinde bulunmalı', () => {
    expect(SEARCHING_ALGORITHMS['exponential-search']).toBeDefined();
    expect(ALL_ALGORITHMS.find((a) => a.metadata.id === 'exponential-search')).toBeDefined();

    const algo = getAlgorithmById('exponential-search');
    expect(algo).toBeDefined();
    expect(algo?.metadata.name).toContain('Exponential Search');
    expect(algo?.metadata.category).toBe('searching');
  });

  it('2. BOUND fazında BOUND ve PREV pointer rozetleri ekranda görünmeli', () => {
    const mockBoundStep: SimulationEvent = {
      stepIndex: 2,
      totalSteps: 5,
      type: 'COMPARE',
      indices: [2],
      values: [43, 60],
      arraySnapshot: sortedArray,
      sortedIndices: [],
      stats: { pass: 1, comparisons: 2, swaps: 0 },
      meta: {
        kind: 'exponential-search',
        phase: 'BOUND',
        boundIndex: 2,
        previousBound: 1,
      },
    };

    render(
      <ArrayVisualizer step={mockBoundStep as any} initialArray={initialArray} />
    );

    expect(screen.getByText('SINIR')).toBeDefined();
    expect(screen.getByText('ÖNCEKİ')).toBeDefined();
  });

  it('3. BINARY fazında Low, Mid, High (ALT, ORTA, ÜST) rozetleri ve arama aralığı görünmeli', () => {
    const mockBinaryStep: SimulationEvent = {
      stepIndex: 4,
      totalSteps: 5,
      type: 'COMPARE',
      indices: [3],
      values: [60, 60],
      arraySnapshot: sortedArray,
      sortedIndices: [3],
      stats: { pass: 1, comparisons: 4, swaps: 0 },
      meta: {
        kind: 'exponential-search',
        phase: 'BINARY',
        low: 2,
        mid: 3,
        high: 4,
        boundIndex: 4,
        previousBound: 2,
      },
    };

    render(
      <ArrayVisualizer step={mockBinaryStep as any} initialArray={initialArray} />
    );

    expect(screen.getByText('ALT')).toBeDefined();
    expect(screen.getByText('ORTA')).toBeDefined();
    expect(screen.getByText('ÜST')).toBeDefined();
  });

  it('4. Explanation engine Exponential Search özel adım açıklamaları üretmeli', () => {
    const boundEvent: SimulationEvent = {
      stepIndex: 2,
      totalSteps: 4,
      type: 'COMPARE',
      indices: [2],
      values: [43, 99],
      arraySnapshot: sortedArray,
      sortedIndices: [],
      stats: { pass: 1, comparisons: 2, swaps: 0 },
      meta: {
        kind: 'exponential-search',
        phase: 'BOUND',
        boundIndex: 2,
        previousBound: 1,
      },
    };

    const exp = generateStepExplanation(boundEvent);
    expect(exp.title).toContain('Exponential Search');
    expect(exp.description).toContain('sınırı 2 katına çıkarılıyor');
  });

  it('5. workingArray sıralı ve initialArray orijinal sırasını korumalı', () => {
    const unsortedInput = [73, 12, 91, 34, 5, 68, 27];
    const copyOfUnsorted = [...unsortedInput];

    const algo = getAlgorithmById('exponential-search')!;
    const workingArray = [...unsortedInput].sort((a, b) => a - b);
    const events = algo.generateSteps(workingArray, 68);

    expect(events[0].arraySnapshot).toEqual([5, 12, 27, 34, 68, 73, 91]);
    expect(unsortedInput).toEqual(copyOfUnsorted);
  });

  it('6. Target value korunup workingArray indeksine doğru eşleşmeli', () => {
    const unsortedInput = [90, 10, 50, 30];
    const target = 90;
    const workingArray = [...unsortedInput].sort((a, b) => a - b); // [10, 30, 50, 90]

    const algo = getAlgorithmById('exponential-search')!;
    const events = algo.generateSteps(workingArray, target);
    const lastEvent = events[events.length - 1];

    expect(lastEvent.sortedIndices).toEqual([3]);
  });

  it('7. Tüm Sorting algoritmaları (Bubble, Selection, Insertion, Merge, Quick) regressionsuz çalışmalı', () => {
    const sampleArr = [5, 2, 8, 1, 9];

    Object.values(SORTING_ALGORITHMS).forEach((sortAlgo) => {
      const events = sortAlgo.generateSteps([...sampleArr]);
      expect(events.length).toBeGreaterThan(0);
      const lastEvent = events[events.length - 1];
      expect(lastEvent.type).toBe('COMPLETE');
    });
  });
});
