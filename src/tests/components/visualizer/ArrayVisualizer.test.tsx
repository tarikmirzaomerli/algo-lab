import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { ArrayVisualizer } from '../../../components/visualizer/ArrayVisualizer';
import type { AlgorithmStep } from '../../../types/event';

describe('ArrayVisualizer UI Component Unit & Visual State Mapping Tests', () => {
  const defaultInitialArray = [8, 3, 5, 1, 6];

  const createMockStep = (override: Partial<AlgorithmStep> = {}): AlgorithmStep => ({
    stepIndex: 1,
    totalSteps: 5,
    type: 'COMPARE',
    indices: [0, 1],
    values: [8, 3],
    arraySnapshot: [8, 3, 5, 1, 6],
    sortedIndices: [],
    stats: { pass: 1, comparisons: 1, swaps: 0 },
    title: 'Karşılaştırma Adımı',
    description: 'Adım açıklaması',
    ...override,
  });

  describe('1. Default & Empty State Handling', () => {
    it('step = undefined olduğunda initialArray değerleri bar-default sınıfıyla çökmeden render edilmeli', () => {
      const { container } = render(
        <ArrayVisualizer step={undefined} initialArray={defaultInitialArray} />
      );

      const bars = container.querySelectorAll('.bar');
      expect(bars).toHaveLength(5);
      bars.forEach((bar) => {
        expect(bar.classList.contains('bar-default')).toBe(true);
      });
    });

    it('Boş dizi [] verildiğinde bileşen çökmeden render edilmeli', () => {
      const { container } = render(
        <ArrayVisualizer step={undefined} initialArray={[]} />
      );

      const bars = container.querySelectorAll('.bar');
      expect(bars).toHaveLength(0);
      expect(screen.getByText('0 Eleman')).toBeDefined();
    });
  });

  describe('2. Array Snapshot & Bar Value Mapping', () => {
    it('step.arraySnapshot mevcut olduğunda initialArray yerine snapshot değerleri kullanılmalı', () => {
      const mockStep = createMockStep({
        arraySnapshot: [10, 20, 30],
      });

      const { container } = render(
        <ArrayVisualizer step={mockStep} initialArray={[1, 2, 3, 4, 5]} />
      );

      const bars = container.querySelectorAll('.bar');
      expect(bars).toHaveLength(3);
      expect(screen.getByText('10')).toBeDefined();
      expect(screen.getByText('20')).toBeDefined();
      expect(screen.getByText('30')).toBeDefined();
    });
  });

  describe('3. COMPARE Event Visual Mapping', () => {
    it('COMPARE etkinliğinde indices içindeki barlara bar-compare sınıfı uygulanmalı', () => {
      const mockStep = createMockStep({
        type: 'COMPARE',
        indices: [1, 3],
      });

      const { container } = render(
        <ArrayVisualizer step={mockStep} initialArray={defaultInitialArray} />
      );

      const bars = container.querySelectorAll('.bar');
      expect(bars[1].classList.contains('bar-compare')).toBe(true);
      expect(bars[3].classList.contains('bar-compare')).toBe(true);
      expect(bars[0].classList.contains('bar-compare')).toBe(false);
      expect(bars[2].classList.contains('bar-compare')).toBe(false);
    });
  });

  describe('4. SWAP Event Visual Mapping', () => {
    it('SWAP etkinliğinde indices içindeki barlara bar-swap sınıfı uygulanmalı', () => {
      const mockStep = createMockStep({
        type: 'SWAP',
        indices: [0, 2],
      });

      const { container } = render(
        <ArrayVisualizer step={mockStep} initialArray={defaultInitialArray} />
      );

      const bars = container.querySelectorAll('.bar');
      expect(bars[0].classList.contains('bar-swap')).toBe(true);
      expect(bars[2].classList.contains('bar-swap')).toBe(true);
      expect(bars[1].classList.contains('bar-swap')).toBe(false);
    });
  });

  describe('5. OVERWRITE Event Visual Mapping', () => {
    it('OVERWRITE etkinliğinde hedeflenen barlara bar-swap sınıfı uygulanmalı', () => {
      const mockStep = createMockStep({
        type: 'OVERWRITE',
        indices: [2],
      });

      const { container } = render(
        <ArrayVisualizer step={mockStep} initialArray={defaultInitialArray} />
      );

      const bars = container.querySelectorAll('.bar');
      expect(bars[2].classList.contains('bar-swap')).toBe(true);
      expect(bars[0].classList.contains('bar-swap')).toBe(false);
    });
  });

  describe('6. SELECT_MIN & INSERT Events Visual Mapping', () => {
    it('SELECT_MIN etkinliğinde aktif barlara bar-active sınıfı uygulanmalı', () => {
      const mockStep = createMockStep({
        type: 'SELECT_MIN',
        indices: [3],
      });

      const { container } = render(
        <ArrayVisualizer step={mockStep} initialArray={defaultInitialArray} />
      );

      const bars = container.querySelectorAll('.bar');
      expect(bars[3].classList.contains('bar-active')).toBe(true);
    });

    it('INSERT etkinliğinde aktif barlara bar-active sınıfı uygulanmalı', () => {
      const mockStep = createMockStep({
        type: 'INSERT',
        indices: [1],
      });

      const { container } = render(
        <ArrayVisualizer step={mockStep} initialArray={defaultInitialArray} />
      );

      const bars = container.querySelectorAll('.bar');
      expect(bars[1].classList.contains('bar-active')).toBe(true);
    });
  });

  describe('7. Pivot Index & Indicator Badge', () => {
    it('pivotIndex tanımlı olduğunda bar-pivot sınıfı ve PIVOT rozeti basılmalı', () => {
      const mockStep = createMockStep({
        type: 'PIVOT_SELECT',
        pivotIndex: 2,
        indices: [2],
      });

      const { container } = render(
        <ArrayVisualizer step={mockStep} initialArray={defaultInitialArray} />
      );

      const bars = container.querySelectorAll('.bar');
      expect(bars[2].classList.contains('bar-pivot')).toBe(true);
      expect(screen.getByText('PIVOT')).toBeDefined();
    });

    it('pivotIndex undefined olduğunda PIVOT rozeti görünmemeli', () => {
      const mockStep = createMockStep({ pivotIndex: undefined });
      render(
        <ArrayVisualizer step={mockStep} initialArray={defaultInitialArray} />
      );

      expect(screen.queryByText('PIVOT')).toBeNull();
    });
  });

  describe('8. Sorted Indices Visual Mapping', () => {
    it('sortedIndices içindeki barlara bar-sorted sınıfı uygulanmalı', () => {
      const mockStep = createMockStep({
        indices: [],
        sortedIndices: [3, 4],
      });

      const { container } = render(
        <ArrayVisualizer step={mockStep} initialArray={defaultInitialArray} />
      );

      const bars = container.querySelectorAll('.bar');
      expect(bars[3].classList.contains('bar-sorted')).toBe(true);
      expect(bars[4].classList.contains('bar-sorted')).toBe(true);
      expect(bars[0].classList.contains('bar-sorted')).toBe(false);
    });
  });

  describe('9. SubArrayRange & Alt Dizi Vurgusu', () => {
    it('subArrayRange aralığındaki barlara bar-subrange uygulanmalı ve metin basılmalı', () => {
      const mockStep = createMockStep({
        indices: [],
        subArrayRange: [1, 3],
      });

      const { container } = render(
        <ArrayVisualizer step={mockStep} initialArray={defaultInitialArray} />
      );

      const bars = container.querySelectorAll('.bar');
      expect(bars[1].classList.contains('bar-subrange')).toBe(true);
      expect(bars[2].classList.contains('bar-subrange')).toBe(true);
      expect(bars[3].classList.contains('bar-subrange')).toBe(true);
      expect(bars[0].classList.contains('bar-subrange')).toBe(false);
      expect(bars[4].classList.contains('bar-subrange')).toBe(false);

      expect(screen.getByText(/Aktif Alt Dizi Aralığı: \[1 \.\.\. 3\]/)).toBeDefined();
    });
  });

  describe('10. Recursion Frame Display', () => {
    it('recursionFrame mevcutsa çağrı rozeti basılmalı', () => {
      const mockStep = createMockStep({
        recursionFrame: 'mergeSort(sol: 0, sağ: 3)',
      });

      render(
        <ArrayVisualizer step={mockStep} initialArray={defaultInitialArray} />
      );

      expect(screen.getByText('mergeSort(sol: 0, sağ: 3)')).toBeDefined();
    });
  });

  describe('11. Dense Mode & Threshold Tests (25, 30, 40 Eşikleri)', () => {
    it('totalCount = 25 iken dense sınıfı olmamalı', () => {
      const arr25 = Array.from({ length: 25 }, (_, i) => i + 1);
      const { container } = render(
        <ArrayVisualizer step={undefined} initialArray={arr25} />
      );

      const containerEl = container.querySelector('.bars-container');
      expect(containerEl?.classList.contains('dense')).toBe(false);
    });

    it('totalCount = 26 (totalCount > 25) iken dense sınıfı eklenmeli', () => {
      const arr26 = Array.from({ length: 26 }, (_, i) => i + 1);
      const { container } = render(
        <ArrayVisualizer step={undefined} initialArray={arr26} />
      );

      const containerEl = container.querySelector('.bars-container');
      expect(containerEl?.classList.contains('dense')).toBe(true);
    });

    it('totalCount = 30 iken değer yazıları (bar-value) görünmeli, totalCount = 31 iken saklanmalı', () => {
      const arr30 = Array.from({ length: 30 }, (_, i) => i + 1);
      const { container: c30 } = render(
        <ArrayVisualizer step={undefined} initialArray={arr30} />
      );
      expect(c30.querySelectorAll('.bar-value')).toHaveLength(30);

      const arr31 = Array.from({ length: 31 }, (_, i) => i + 1);
      const { container: c31 } = render(
        <ArrayVisualizer step={undefined} initialArray={arr31} />
      );
      expect(c31.querySelectorAll('.bar-value')).toHaveLength(0);
    });

    it('totalCount = 40 iken indeksler (bar-index) görünmeli, totalCount = 41 iken saklanmalı', () => {
      const arr40 = Array.from({ length: 40 }, (_, i) => i + 1);
      const { container: c40 } = render(
        <ArrayVisualizer step={undefined} initialArray={arr40} />
      );
      expect(c40.querySelectorAll('.bar-index')).toHaveLength(40);

      const arr41 = Array.from({ length: 41 }, (_, i) => i + 1);
      const { container: c41 } = render(
        <ArrayVisualizer step={undefined} initialArray={arr41} />
      );
      expect(c41.querySelectorAll('.bar-index')).toHaveLength(0);
    });
  });

  describe('12. Negatif ve Sıfır Değerler Resiliency', () => {
    it('Negatif ve 0 sayıları içeren dizide height hesabı çökmeden yapılmalı', () => {
      const negArr = [-10, 0, 5, -3];
      const { container } = render(
        <ArrayVisualizer step={undefined} initialArray={negArr} />
      );

      const bars = container.querySelectorAll('.bar');
      expect(bars).toHaveLength(4);
    });
  });

  describe('13. Class Önceliği (Class Priority Order)', () => {
    it('Pivot durumu diğer tüm olay sınıflarından daha öncelikli olmalı (isPivot -> bar-pivot)', () => {
      const mockStep = createMockStep({
        type: 'COMPARE',
        indices: [2],
        pivotIndex: 2,
        sortedIndices: [2],
      });

      const { container } = render(
        <ArrayVisualizer step={mockStep} initialArray={defaultInitialArray} />
      );

      const bars = container.querySelectorAll('.bar');
      // Pivot en üst sırada tanımlı olduğu için yalnız 'bar-pivot' almalı
      expect(bars[2].classList.contains('bar-pivot')).toBe(true);
      expect(bars[2].classList.contains('bar-compare')).toBe(false);
      expect(bars[2].classList.contains('bar-sorted')).toBe(false);
    });
  });

  describe('14. Render Sayısı Doğruluğu', () => {
    it('5 eleman için 5 bar, 50 eleman için 50 bar render edilmeli', () => {
      const { container: c5 } = render(
        <ArrayVisualizer step={undefined} initialArray={[1, 2, 3, 4, 5]} />
      );
      expect(c5.querySelectorAll('.bar')).toHaveLength(5);

      const arr50 = Array.from({ length: 50 }, (_, i) => i + 1);
      const { container: c50 } = render(
        <ArrayVisualizer step={undefined} initialArray={arr50} />
      );
      expect(c50.querySelectorAll('.bar')).toHaveLength(50);
    });
  });

  describe('15. Hover & Focus Tooltip Removal Verification', () => {
    it('Bar üzerine gelindiğinde (mouseEnter/focus) bar-popover tooltip KESİNLİKLE render edilmemeli', () => {
      const mockStep = createMockStep({
        type: 'COMPARE',
        indices: [0, 1],
        values: [8, 3],
      });

      const { container } = render(
        <ArrayVisualizer step={mockStep} initialArray={defaultInitialArray} />
      );

      const barWrappers = container.querySelectorAll('.bar-wrapper');
      expect(barWrappers).toHaveLength(5);

      // Bar 0 üzerine gelinmesi
      fireEvent.mouseEnter(barWrappers[0]);
      expect(container.querySelector('.bar-popover')).toBeNull();

      fireEvent.mouseLeave(barWrappers[0]);
      expect(container.querySelector('.bar-popover')).toBeNull();
    });

    it('Pivot bar üzerine gelindiğinde popover tooltip KESİNLİKLE render edilmemeli', () => {
      const mockStep = createMockStep({
        pivotIndex: 2,
      });

      const { container } = render(
        <ArrayVisualizer step={mockStep} initialArray={defaultInitialArray} />
      );

      const barWrappers = container.querySelectorAll('.bar-wrapper');
      fireEvent.mouseEnter(barWrappers[2]);

      expect(container.querySelector('.bar-popover')).toBeNull();
    });
  });

  describe('16. Search Target Pill Display', () => {
    it('isSearch adımı verildiğinde header bölümünde target-pill ve aranan hedef değer basılmalı', () => {
      const mockSearchStep = createMockStep({
        type: 'COMPARE',
        indices: [0],
        values: [4, 9],
        meta: { kind: 'linear-search' },
      });

      render(
        <ArrayVisualizer step={mockSearchStep} initialArray={defaultInitialArray} />
      );

      expect(screen.getByText(/Hedef:/)).toBeDefined();
      expect(screen.getByText('9')).toBeDefined();
    });

    it('Sorting adımı verildiğinde target-pill header bölümünde görünmemeli', () => {
      const mockSortingStep = createMockStep({
        type: 'COMPARE',
        indices: [0, 1],
        values: [8, 3],
      });

      render(
        <ArrayVisualizer step={mockSortingStep} initialArray={defaultInitialArray} />
      );

      expect(screen.queryByText(/Hedef:/)).toBeNull();
    });

    it('Searching adımı esnasında search-status-bar KESİNLİKLE render edilmemeli', () => {
      const mockSearchStep = createMockStep({
        type: 'COMPARE',
        indices: [2],
        values: [5, 9],
        stats: { pass: 1, comparisons: 3, swaps: 0 },
        meta: { kind: 'linear-search' },
      });

      const { container } = render(
        <ArrayVisualizer step={mockSearchStep} initialArray={defaultInitialArray} />
      );

      expect(container.querySelector('.search-status-bar')).toBeNull();
    });

    it('Search adımlarında kart durumları (card-active, card-visited, card-default) ve ilerleme çubuğu doğru hesaplanmalı', () => {
      const mockSearchStep = createMockStep({
        type: 'COMPARE',
        indices: [2],
        values: [5, 9],
        arraySnapshot: [8, 3, 5, 1, 6],
        stats: { pass: 1, comparisons: 3, swaps: 0 },
        meta: { kind: 'linear-search' },
      });

      const { container } = render(
        <ArrayVisualizer step={mockSearchStep} initialArray={defaultInitialArray} />
      );

      const cards = container.querySelectorAll('.search-card');
      expect(cards).toHaveLength(5);
      expect(cards[0].classList.contains('card-visited')).toBe(true);
      expect(cards[1].classList.contains('card-visited')).toBe(true);
      expect(cards[2].classList.contains('card-active')).toBe(true);
      expect(cards[3].classList.contains('card-default')).toBe(true);
      expect(cards[4].classList.contains('card-default')).toBe(true);

      const fill = container.querySelector('.search-progress-fill') as HTMLElement;
      expect(fill?.style.width).toBe('60%');
    });

    it('Hedef bulunduğunda veya bulunamadığında search-status-bar KESİNLİKLE render edilmemeli', () => {
      const mockFoundStep = createMockStep({
        type: 'COMPLETE',
        indices: [3],
        values: [9, 9],
        sortedIndices: [3],
        stats: { pass: 1, comparisons: 4, swaps: 0 },
        meta: { kind: 'linear-search' },
      });

      const { container } = render(
        <ArrayVisualizer step={mockFoundStep} initialArray={defaultInitialArray} />
      );

      expect(container.querySelector('.search-status-bar')).toBeNull();
    });

    it('Mouse hover/focus yapıldığında kartlarda veya barlarda popover tooltip render edilmemeli', () => {
      const mockStep = createMockStep();
      const { container } = render(
        <ArrayVisualizer step={mockStep} initialArray={defaultInitialArray} />
      );

      const barWrapper = container.querySelector('.bar-wrapper');
      if (barWrapper) {
        fireEvent.mouseEnter(barWrapper);
        expect(container.querySelector('.bar-popover')).toBeNull();
        expect(container.querySelector('[role="tooltip"]')).toBeNull();
      }
    });

    it('Sorting adımı verildiğinde search-status-bar render edilmemeli ve barlar basılmalı', () => {
      const mockSortingStep = createMockStep({
        type: 'COMPARE',
        indices: [0, 1],
        values: [8, 3],
      });

      const { container } = render(
        <ArrayVisualizer step={mockSortingStep} initialArray={defaultInitialArray} />
      );

      expect(container.querySelector('.search-status-bar')).toBeNull();
      expect(container.querySelectorAll('.bar')).toHaveLength(5);
    });

    it('Searching adımı için onRandomizeTarget geçildiğinde Yeni Hedef butonu görünmeli ve tıklanabilmeli', () => {
      const mockSearchStep = createMockStep({
        type: 'COMPARE',
        indices: [0],
        values: [4, 9],
        meta: { kind: 'linear-search' },
      });
      const randomizeSpy = vi.fn();

      render(
        <ArrayVisualizer
          step={mockSearchStep}
          initialArray={defaultInitialArray}
          onRandomizeTarget={randomizeSpy}
        />
      );

      const btn = screen.getByRole('button', { name: /Yeni hedef değer seç/i });
      expect(btn).toBeDefined();

      fireEvent.click(btn);
      expect(randomizeSpy).toHaveBeenCalledTimes(1);
    });

    it('Sorting adımı için onRandomizeTarget geçilse bile Yeni Hedef butonu görünmemeli', () => {
      const mockSortingStep = createMockStep({
        type: 'COMPARE',
        indices: [0, 1],
        values: [8, 3],
      });
      const randomizeSpy = vi.fn();

      render(
        <ArrayVisualizer
          step={mockSortingStep}
          initialArray={defaultInitialArray}
          onRandomizeTarget={randomizeSpy}
        />
      );

      expect(screen.queryByRole('button', { name: /Yeni hedef değer seç/i })).toBeNull();
    });
  });
});
