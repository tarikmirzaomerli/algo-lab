import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { StepExplanationPanel } from '../../../../components/panels/StepExplanationPanel';
import type { AlgorithmStep } from '../../../../types/event';

describe('StepExplanationPanel UI Component Unit & Rendering Tests', () => {
  const createMockStep = (override: Partial<AlgorithmStep> = {}): AlgorithmStep => ({
    stepIndex: 3,
    totalSteps: 10,
    type: 'COMPARE',
    indices: [0, 1],
    values: [8, 3],
    arraySnapshot: [8, 3, 5, 1],
    sortedIndices: [],
    stats: {
      pass: 1,
      comparisons: 2,
      swaps: 1,
    },
    title: 'Karşılaştırma: İndeks 0 (8) vs İndeks 1 (3)',
    description: 'İndeks 0 (8) ile İndeks 1 (3) karşılaştırılıyor. Soldaki değer sağdakinden küçük olmalıdır.',
    formula: '8 > 3',
    ...override,
  });

  describe('1. Empty State Handling', () => {
    it('step = undefined iken çökmeden boş durum mesajı basmalı', () => {
      render(
        <StepExplanationPanel
          step={undefined}
          currentStepIdx={0}
          totalSteps={0}
        />
      );

      const emptyMsg = screen.getByText('Henüz bir simülasyon adımı bulunmuyor.');
      expect(emptyMsg).toBeDefined();
    });
  });

  describe('2. Basic Step Information Rendering', () => {
    it('Adım sayısı, event rozeti, başlık ve detay metni doğru basılmalı', () => {
      const mockStep = createMockStep({
        stepIndex: 3,
        type: 'COMPARE',
        title: 'Örnek Karşılaştırma Başlığı',
        description: 'Örnek açıklama metni.',
      });

      const { container } = render(
        <StepExplanationPanel
          step={mockStep}
          currentStepIdx={2}
          totalSteps={10}
        />
      );

      // Adım sayacı: Adım 3 / 10 (.counter-text)
      const counterText = container.querySelector('.counter-text');
      expect(counterText).toBeDefined();
      expect(counterText?.textContent).toContain('Adım 3 / 10');

      // Event Type Badge
      expect(screen.getByText('KARŞILAŞTIRMA')).toBeDefined();

      // Title & Description
      expect(screen.getByText('Örnek Karşılaştırma Başlığı')).toBeDefined();
      expect(screen.getByText('Örnek açıklama metni.')).toBeDefined();
    });
  });

  describe('3. Step Progress Calculation', () => {
    it('currentStepIdx ve totalSteps oranına göre ilerleme çubuğu genişliği hesaplanmalı', () => {
      const mockStep = createMockStep();
      const { container } = render(
        <StepExplanationPanel
          step={mockStep}
          currentStepIdx={4} // (4 + 1) / 10 = %50
          totalSteps={10}
        />
      );

      const progressFill = container.querySelector('.step-progress-fill') as HTMLElement;
      expect(progressFill).toBeDefined();
      expect(progressFill.style.width).toBe('50%');
    });
  });

  describe('4. Formula Box Conditional Rendering', () => {
    it('formula tanımlı olduğunda formül kutusu ekranda görünmeli', () => {
      const mockStep = createMockStep({ formula: '8 > 3' });
      render(
        <StepExplanationPanel
          step={mockStep}
          currentStepIdx={0}
          totalSteps={10}
        />
      );

      expect(screen.getByText('Matematiksel / Mantıksal İşlem:')).toBeDefined();
      expect(screen.getByText('8 > 3')).toBeDefined();
    });

    it('formula undefined olduğunda formül kutusu DOM\'da bulunmamalı', () => {
      const mockStep = createMockStep({ formula: undefined });
      render(
        <StepExplanationPanel
          step={mockStep}
          currentStepIdx={0}
          totalSteps={10}
        />
      );

      expect(screen.queryByText('Matematiksel / Mantıksal İşlem:')).toBeNull();
    });
  });

  describe('5. Stats Grid Rendering', () => {
    it('stats değerleri (pass, comparisons, swaps) kullanıcıya doğru gösterilmeli', () => {
      const mockStep = createMockStep({
        stats: {
          pass: 2,
          comparisons: 12,
          swaps: 4,
        },
      });

      const { container } = render(
        <StepExplanationPanel
          step={mockStep}
          currentStepIdx={1}
          totalSteps={10}
        />
      );

      const statVals = Array.from(container.querySelectorAll('.stat-card .stat-val')).map(
        (el) => el.textContent
      );
      expect(statVals).toContain('2');
      expect(statVals).toContain('12');
      expect(statVals).toContain('4');
    });
  });

  describe('6. Pivot Card Conditional Rendering', () => {
    it('pivotIndex tanımlı olduğunda Aktif Pivot istatistik kartı gösterilmeli', () => {
      const mockStep = createMockStep({
        pivotIndex: 2,
        arraySnapshot: [3, 1, 6, 5],
      });

      render(
        <StepExplanationPanel
          step={mockStep}
          currentStepIdx={2}
          totalSteps={10}
        />
      );

      expect(screen.getByText('Aktif Pivot')).toBeDefined();
      expect(screen.getByText('İndeks 2 (6)')).toBeDefined();
    });

    it('pivotIndex undefined olduğunda pivot kartı görünmemeli', () => {
      const mockStep = createMockStep({ pivotIndex: undefined });
      render(
        <StepExplanationPanel
          step={mockStep}
          currentStepIdx={0}
          totalSteps={10}
        />
      );

      expect(screen.queryByText('Aktif Pivot')).toBeNull();
    });
  });

  describe('7. Event Type Badge Styling & Labels', () => {
    const eventTypeMappings: [AlgorithmStep['type'], string][] = [
      ['COMPARE', 'KARŞILAŞTIRMA'],
      ['SWAP', 'YER DEĞİŞTİRME'],
      ['PIVOT_SELECT', 'PİVOT SEÇİMİ'],
      ['COMPLETE', 'TAMAMLANDI'],
    ];

    eventTypeMappings.forEach(([type, expectedLabel]) => {
      it(`${type} etkinliği için ${expectedLabel} rozeti basılmalı`, () => {
        const mockStep = createMockStep({ type });
        render(
          <StepExplanationPanel
            step={mockStep}
            currentStepIdx={0}
            totalSteps={5}
          />
        );

        expect(screen.getByText(expectedLabel)).toBeDefined();
      });
    });
  });

  describe('8. Edge Cases & Resilience Tests', () => {
    it('Çok uzun başlık ve açıklama metni içeren adım çökmeden render edilmeli', () => {
      const longTitle = 'A'.repeat(200);
      const longDescription = 'B'.repeat(1000);
      const mockStep = createMockStep({
        title: longTitle,
        description: longDescription,
      });

      const { container } = render(
        <StepExplanationPanel
          step={mockStep}
          currentStepIdx={0}
          totalSteps={1}
        />
      );

      const titleEl = container.querySelector('.step-title');
      const descEl = container.querySelector('.explanation-text');

      expect(titleEl?.textContent).toBe(longTitle);
      expect(descEl?.textContent).toBe(longDescription);
    });

    it('totalSteps = 1 ve currentStepIdx = 0 iken doğru oran (Adım 1 / 1) gösterilmeli', () => {
      const mockStep = createMockStep({
        stepIndex: 1,
        totalSteps: 1,
      });

      const { container } = render(
        <StepExplanationPanel
          step={mockStep}
          currentStepIdx={0}
          totalSteps={1}
        />
      );

      const counterText = container.querySelector('.counter-text');
      expect(counterText).toBeDefined();
      expect(counterText?.textContent).toContain('Adım 1 / 1');

      const progressFill = container.querySelector('.step-progress-fill') as HTMLElement;
      expect(progressFill.style.width).toBe('100%');
    });
  });

  describe('9. Educational UX & Macro Strategy Card (P1-A)', () => {
    it('Metin içindeki sayılar highlight-tag elemanları olarak render edilmeli', () => {
      const mockStep = createMockStep({
        description: 'İndeks 0 (8) ile İndeks 1 (3) karşılaştırılıyor.',
      });

      const { container } = render(
        <StepExplanationPanel
          step={mockStep}
          currentStepIdx={0}
          totalSteps={5}
        />
      );

      const highlights = container.querySelectorAll('.explanation-text .highlight-tag');
      expect(highlights.length).toBeGreaterThan(0);
      const highlightedTexts = Array.from(highlights).map((h) => h.textContent);
      expect(highlightedTexts).toContain('0');
      expect(highlightedTexts).toContain('8');
      expect(highlightedTexts).toContain('1');
      expect(highlightedTexts).toContain('3');
    });

    it('Makro algoritma stratejisi kartı seçili algoritmaya göre doğru rozet ve strateji metni basmalı', () => {
      const mockStep = createMockStep({
        type: 'COMPARE',
        stats: { pass: 1, comparisons: 1, swaps: 0 },
      });

      render(
        <StepExplanationPanel
          step={mockStep}
          currentStepIdx={0}
          totalSteps={5}
          selectedAlgoId="bubble-sort"
          algoName="Bubble Sort"
        />
      );

      expect(screen.getByText(/Baloncuk Sıralaması · Tur 1/i)).toBeDefined();
      expect(screen.getByText(/Komşu elemanlar karşılaştırılıyor/i)).toBeDefined();
    });

    it('Binary Search seçildiğinde makro strateji kartı doğru pedagojik açıklamayı basmalı', () => {
      const mockStep = createMockStep({
        type: 'COMPARE',
        stats: { pass: 1, comparisons: 1, swaps: 0 },
        meta: { kind: 'binary-search', low: 0, mid: 2, high: 5 },
      });

      render(
        <StepExplanationPanel
          step={mockStep}
          currentStepIdx={0}
          totalSteps={5}
          selectedAlgoId="binary-search"
          algoName="Binary Search"
        />
      );

      expect(screen.getByText(/İkili Arama \(Binary Search\)/i)).toBeDefined();
      expect(screen.getByText(/arama alanı her adımda yarıya küçülür/i)).toBeDefined();
      expect(screen.queryByText(/diziyi küçükten büyüğe sıralamaktır/i)).toBeNull();
    });
  });
});
