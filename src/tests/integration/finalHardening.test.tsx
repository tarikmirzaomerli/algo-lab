import { render } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { ArrayVisualizer } from '../../components/visualizer/ArrayVisualizer';
import { getAlgorithmById, SEARCHING_ALGORITHMS } from '../../core/algorithms';
import type { SimulationEvent } from '../../types/event';
import { isSearchMeta } from '../../types/event';

describe('Algo Lab Final UX, Pedagogy, A11y & Transition Hardening Suite', () => {
  const sampleArray = [73, 12, 91, 34, 5, 68, 27];
  const sortedArray = [5, 12, 27, 34, 68, 73, 91];

  describe('1. Sıralı Dizi Bilgilendirme Banner Testleri', () => {
    it('Jump, Exponential ve Interpolation Search modunda bilgilendirme banneri gösterilmeli', () => {
      ['jump-search', 'exponential-search', 'interpolation-search'].forEach((algoId) => {
        const algo = getAlgorithmById(algoId)!;
        const events = algo.generateSteps(sortedArray, 34);

        const { container, unmount } = render(
          <ArrayVisualizer step={events[0] as any} initialArray={sampleArray} />
        );

        const banner = container.querySelector('.sorted-array-notice-banner');
        expect(banner).not.toBeNull();
        expect(banner?.textContent).toContain('sıralı veri seti gerektirir');
        expect(banner?.textContent).toContain('Orijinal diziniz değiştirilmedi');

        unmount();
      });
    });

    it('Binary Search, Linear Search ve Sorting algoritmalarında bilgilendirme banneri KESİNLİKLE gösterilmemeli', () => {
      ['binary-search', 'linear-search'].forEach((algoId) => {
        const algo = getAlgorithmById(algoId)!;
        const events = algo.generateSteps(sampleArray, 34);
        const { container, unmount } = render(
          <ArrayVisualizer step={events[0] as any} initialArray={sampleArray} />
        );
        expect(container.querySelector('.sorted-array-notice-banner')).toBeNull();
        unmount();
      });

      // Bubble Sort
      const bubbleAlgo = getAlgorithmById('bubble-sort')!;
      const bubbleEvents = bubbleAlgo.generateSteps(sampleArray);
      const { container: bubbleContainer, unmount: unmountBubble } = render(
        <ArrayVisualizer step={bubbleEvents[0] as any} initialArray={sampleArray} />
      );
      expect(bubbleContainer.querySelector('.sorted-array-notice-banner')).toBeNull();
      unmountBubble();
    });
  });

  describe('2. Search Status Bar & Hover Tooltip Removal Verification', () => {
    it('Hiçbir Search algoritmasında (Linear, Binary, Jump, Exponential, Interpolation) alt search-status-bar render edilmemeli', () => {
      ['linear-search', 'binary-search', 'jump-search', 'exponential-search', 'interpolation-search'].forEach((algoId) => {
        const algo = getAlgorithmById(algoId)!;
        const workArr = algoId === 'linear-search' ? sampleArray : sortedArray;
        const events = algo.generateSteps(workArr, 34);

        const { container, unmount } = render(
          <ArrayVisualizer step={events[0] as any} initialArray={sampleArray} />
        );

        expect(container.querySelector('.search-status-bar')).toBeNull();
        unmount();
      });
    });

    it('Hiçbir Array / Search kartı üzerinde hover tooltipleri (bar-popover / role="tooltip") render edilmemeli', () => {
      ['linear-search', 'binary-search', 'bubble-sort', 'quick-sort'].forEach((algoId) => {
        const algo = getAlgorithmById(algoId)!;
        const workArr = algoId === 'linear-search' || algoId === 'bubble-sort' || algoId === 'quick-sort' ? sampleArray : sortedArray;
        const events = algo.generateSteps(workArr, 34);

        const { container, unmount } = render(
          <ArrayVisualizer step={events[0] as any} initialArray={sampleArray} />
        );

        expect(container.querySelector('.bar-popover')).toBeNull();
        expect(container.querySelector('[role="tooltip"]')).toBeNull();

        unmount();
      });
    });
  });

  describe('3. FAZ 3: Accessibility (A11y) & Non-Color State Indicators', () => {
    it('Hedef bulunduğunda (card-found) visualizer kartı üzerinde ✓ sembolü gösterilmeli', () => {
      const mockFoundStep: SimulationEvent = {
        stepIndex: 3,
        totalSteps: 3,
        type: 'COMPLETE',
        indices: [3],
        values: [34, 34],
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

      const { container } = render(
        <ArrayVisualizer step={mockFoundStep as any} initialArray={sampleArray} />
      );

      const foundCard = container.querySelector('.search-card.card-found');
      expect(foundCard).not.toBeNull();
      const checkIcon = foundCard?.querySelector('.card-check-icon');
      expect(checkIcon).not.toBeNull();
    });

    it('Elenmiş kartlar (card-visited) dashed border ve aria-label durum etiketi taşımalı', () => {
      const mockVisitedStep: SimulationEvent = {
        stepIndex: 2,
        totalSteps: 4,
        type: 'COMPARE',
        indices: [1],
        values: [12, 34],
        arraySnapshot: sortedArray,
        sortedIndices: [],
        stats: { pass: 1, comparisons: 2, swaps: 0 },
        meta: {
          kind: 'binary-search',
          low: 0,
          mid: 1,
          high: 3,
        },
      };

      const { container } = render(
        <ArrayVisualizer step={mockVisitedStep as any} initialArray={sampleArray} />
      );

      const cards = container.querySelectorAll('.search-card-wrapper');
      // Index 5 (73) high (3) üstünde olduğu için elenmiş olmalı
      expect(cards[5].getAttribute('aria-label')).toContain('Elendi');
    });
  });

  describe('4. FAZ 4: State Transition & Regression Safety', () => {
    it('Tüm 4 Search algoritması ve 5 Sorting algoritması sırayla çağrıldığında error veya state sızıntısı yaşanmamalı', () => {
      const searchKeys = ['linear-search', 'binary-search', 'jump-search', 'exponential-search'];
      const sortKeys = ['bubble-sort', 'selection-sort', 'insertion-sort', 'merge-sort', 'quick-sort'];

      // Search pipeline
      searchKeys.forEach((key) => {
        const algo = getAlgorithmById(key)!;
        const workArr = key === 'linear-search' ? sampleArray : sortedArray;
        const steps = algo.generateSteps(workArr, 34);
        expect(steps.length).toBeGreaterThan(0);
        expect(isSearchMeta(steps[0].meta)).toBe(true);
      });

      // Sorting pipeline
      sortKeys.forEach((key) => {
        const algo = getAlgorithmById(key)!;
        const steps = algo.generateSteps([...sampleArray]);
        expect(steps.length).toBeGreaterThan(0);
        expect(isSearchMeta(steps[0].meta)).toBe(false);
      });
    });

    it('Duplicate array verileriyle ([5, 5, 5, 5], [10, 20, 20, 30, 40]) tüm algoritmalar güvenli sonlanmalı', () => {
      const dup1 = [5, 5, 5, 5];
      const dup2 = [10, 20, 20, 30, 40];

      Object.values(SEARCHING_ALGORITHMS).forEach((algo) => {
        const steps1 = algo.generateSteps(dup1, 5);
        expect(steps1[steps1.length - 1].type).toBe('COMPLETE');

        const steps2 = algo.generateSteps(dup2, 20);
        expect(steps2[steps2.length - 1].type).toBe('COMPLETE');
      });
    });
  });
});
