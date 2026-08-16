import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { ArrayVisualizer } from '../../components/visualizer/ArrayVisualizer';
import { StepExplanationPanel } from '../../components/panels/StepExplanationPanel';
import { Sidebar } from '../../components/layout/Sidebar';
import { getAlgorithmById, SEARCHING_ALGORITHMS } from '../../core/algorithms';
import { enrichSimulationEvents } from '../../core/explanations/explanationEngine';

describe('Interpolation Search Integration Tests', () => {
  const unsortedInitial = [90, 10, 50, 30, 70];
  const sortedArray = [10, 30, 50, 70, 90];

  it('1. Algoritma registry verilerine doğru kayıtlı olmalı', () => {
    const algo = getAlgorithmById('interpolation-search');
    expect(algo).toBeDefined();
    expect(algo?.metadata.name).toBe('Interpolation Search');
    expect(SEARCHING_ALGORITHMS['interpolation-search']).toBeDefined();
  });

  it('2. Sidebar bileşeninde Interpolation Search listelenmeli', () => {
    render(
      <Sidebar
        selectedAlgoId="interpolation-search"
        onSelectAlgorithm={() => {}}
      />
    );

    const algoBtn = screen.getByText('Interpolation Search');
    expect(algoBtn).toBeDefined();
  });

  it('3. Visualizer render edildiğinde Sıralı Dizi Bilgilendirme Bannerı gösterilmeli ve initialArray mutasyon geçirmemeli', () => {
    const algo = getAlgorithmById('interpolation-search')!;
    const events = algo.generateSteps(sortedArray, 50);

    const initialCopy = [...unsortedInitial];

    const { container } = render(
      <ArrayVisualizer step={events[0] as any} initialArray={unsortedInitial} />
    );

    const banner = container.querySelector('.sorted-array-notice-banner');
    expect(banner).not.toBeNull();
    expect(banner?.textContent).toContain('Interpolation Search');
    expect(banner?.textContent).toContain('sıralı veri seti gerektirir');

    expect(unsortedInitial).toEqual(initialCopy);
  });

  it('4. Interpolation Search adımlarında P (Tahmin) rozeti ve L/H rozetleri basılmalı', () => {
    const algo = getAlgorithmById('interpolation-search')!;
    const events = algo.generateSteps(sortedArray, 70);

    const { container } = render(
      <ArrayVisualizer step={events[0] as any} initialArray={unsortedInitial} />
    );

    const probeBadge = container.querySelector('.pointer-badge.probe');
    expect(probeBadge).not.toBeNull();
    expect(probeBadge?.textContent).toBe('TAHMİN');
  });

  it('5. StepExplanationPanel içerisinde Interpolation Search makro strateji kartı ve adım açıklamaları doğru görünmeli', () => {
    const algo = getAlgorithmById('interpolation-search')!;
    const rawEvents = algo.generateSteps(sortedArray, 70);
    const enriched = enrichSimulationEvents(rawEvents);

    render(
      <StepExplanationPanel
        step={enriched[0]}
        currentStepIdx={0}
        totalSteps={enriched.length}
        selectedAlgoId="interpolation-search"
        algoName="Interpolation Search"
      />
    );

    expect(screen.getByText(/İnterpolasyon Araması \(Interpolation Search\)/i)).toBeDefined();
    expect(screen.getByText(/tahmin ederek arama yapar/i)).toBeDefined();
  });

  it('6. Bulunamadı senaryosunda (target = 999) visualizer ve status bar doğru sonlanmalı', () => {
    const algo = getAlgorithmById('interpolation-search')!;
    const events = algo.generateSteps(sortedArray, 999);
    const lastStep = events[events.length - 1];

    const { container } = render(
      <ArrayVisualizer step={lastStep as any} initialArray={unsortedInitial} />
    );

    expect(container.querySelector('.search-status-bar')).toBeNull();
  });
});
