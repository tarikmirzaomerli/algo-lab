import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { ALL_ALGORITHMS, getAlgorithmById, SEARCHING_ALGORITHMS } from '../../core/algorithms';
import { Sidebar } from '../../components/layout/Sidebar';
import { generateStepExplanation } from '../../core/explanations/explanationEngine';
import type { SimulationEvent } from '../../types/event';

describe('Linear Search Entegrasyon ve Açıklama Motoru Testleri (Phase 2)', () => {
  it('A) Linear Search registry katmanında doğru kayıtlı olmalı', () => {
    const algo = getAlgorithmById('linear-search');
    expect(algo).toBeDefined();
    expect(algo?.metadata.name).toContain('Linear Search');

    expect(SEARCHING_ALGORITHMS['linear-search']).toBeDefined();
    expect(ALL_ALGORITHMS.some((a) => a.metadata.id === 'linear-search')).toBe(true);
  });

  it('B) Sidebar bileşeninde Searching kategorisi aktif olmalı ve Linear Search görünmeli', () => {
    const handleSelect = vi.fn();
    render(<Sidebar selectedAlgoId="bubble-sort" onSelectAlgorithm={handleSelect} />);

    expect(screen.getByText('Searching (Arama)')).toBeDefined();
    expect(screen.getByText('Linear Search (Doğrusal Arama)')).toBeDefined();
  });

  it('C) Sidebar üzerinden Linear Search tıklandığında onSelectAlgorithm doğru id ile çağrılmalı', () => {
    const handleSelect = vi.fn();
    render(<Sidebar selectedAlgoId="bubble-sort" onSelectAlgorithm={handleSelect} />);

    const button = screen.getByRole('button', { name: /Linear Search/i });
    fireEvent.click(button);

    expect(handleSelect).toHaveBeenCalledTimes(1);
    expect(handleSelect).toHaveBeenCalledWith('linear-search');
  });

  it('D) Linear Search COMPARE event (eşleşmeme adımı) doğru açıklamayı oluşturmalı', () => {
    const event: SimulationEvent = {
      stepIndex: 0,
      totalSteps: 5,
      type: 'COMPARE',
      indices: [0],
      values: [4, 9],
      arraySnapshot: [4, 8, 2, 9],
      sortedIndices: [],
      stats: { comparisons: 1, swaps: 0, pass: 1 },
      meta: { kind: 'linear-search' },
    };

    const explanation = generateStepExplanation(event);
    expect(explanation.title).toContain('Karşılaştırma');
    expect(explanation.description).toContain('4 değeri, aranan 9 değeri ile karşılaştırılıyor');
    expect(explanation.formula).toBe('4 ≠ 9');
  });

  it('E) Linear Search MATCH COMPARE event (eşleşme adımı) doğru açıklamayı oluşturmalı', () => {
    const event: SimulationEvent = {
      stepIndex: 3,
      totalSteps: 5,
      type: 'COMPARE',
      indices: [3],
      values: [9, 9],
      arraySnapshot: [4, 8, 2, 9],
      sortedIndices: [3],
      stats: { comparisons: 4, swaps: 0, pass: 1 },
      meta: { kind: 'linear-search' },
    };

    const explanation = generateStepExplanation(event);
    expect(explanation.title).toContain('Hedef Bulundu!');
    expect(explanation.description).toContain('9 değeri aranan 9 değeri ile eşleşti! Hedef bulundu');
    expect(explanation.formula).toContain('EŞLEŞTİ');
  });

  it('F) Linear Search not-found COMPLETE açıklaması doğru oluşturulmalı', () => {
    const event: SimulationEvent = {
      stepIndex: 4,
      totalSteps: 5,
      type: 'COMPLETE',
      indices: [],
      values: [99],
      arraySnapshot: [4, 8, 2, 9],
      sortedIndices: [],
      stats: { comparisons: 4, swaps: 0, pass: 1 },
      meta: { kind: 'linear-search' },
    };

    const explanation = generateStepExplanation(event);
    expect(explanation.title).toBe('Arama Tamamlandı');
    expect(explanation.description).toContain('99 değeri dizide bulunamadı');
  });

  it('G) Sorting COMPARE açıklamalarının mevcut davranışı bozulmamış olmalı', () => {
    const sortingEvent: SimulationEvent = {
      stepIndex: 0,
      totalSteps: 10,
      type: 'COMPARE',
      indices: [0, 1],
      values: [8, 4],
      arraySnapshot: [8, 4, 2, 9],
      sortedIndices: [],
      stats: { comparisons: 1, swaps: 0, pass: 1 },
    };

    const explanation = generateStepExplanation(sortingEvent);
    expect(explanation.title).toBe('Karşılaştırma: İndeks 0 (8) vs İndeks 1 (4)');
    expect(explanation.description).toContain('İndeks 0 (8) ile İndeks 1 (4) karşılaştırılıyor');
    expect(explanation.formula).toBe('8 > 4');
  });
});
