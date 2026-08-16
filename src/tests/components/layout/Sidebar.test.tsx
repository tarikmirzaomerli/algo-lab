import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { Sidebar } from '../../../components/layout/Sidebar';

describe('Sidebar Component & Complexity Badges (P1-B & Accordion)', () => {
  it('Tüm algoritmaların zaman karmaşıklığı rozetleri (O(n²), O(n log n), O(n log n) avg.) doğru render edilmeli', () => {
    const onSelectAlgorithm = vi.fn();
    const { container } = render(
      <Sidebar selectedAlgoId="bubble-sort" onSelectAlgorithm={onSelectAlgorithm} />
    );

    const badges = Array.from(container.querySelectorAll('.complexity-badge')).map(
      (el) => el.textContent
    );

    expect(badges).toContain('O(n²)');
    expect(badges).toContain('O(n log n)');
    expect(badges).toContain('O(n log n) avg.');
  });

  it('Algoritma tıklandığında onSelectAlgorithm callback doğru ID ile çağrılmalı ve aria-current korunmalı', () => {
    const onSelectAlgorithm = vi.fn();
    const { container } = render(
      <Sidebar selectedAlgoId="bubble-sort" onSelectAlgorithm={onSelectAlgorithm} />
    );

    const bubbleBtn = container.querySelector('.sub-menu-item.selected');
    expect(bubbleBtn?.getAttribute('aria-current')).toBe('page');

    const selectionBtn = screen.getByRole('button', { name: /Seçmeli Sıralama/i });
    selectionBtn.click();
    expect(onSelectAlgorithm).toHaveBeenCalledWith('selection-sort');
  });

  it('Kategori başlığına tıklandığında expand/collapse çalışmalı ve aria-expanded güncellenmeli', () => {
    const onSelectAlgorithm = vi.fn();
    render(<Sidebar selectedAlgoId="bubble-sort" onSelectAlgorithm={onSelectAlgorithm} />);

    const sortingToggleBtn = screen.getByRole('button', { name: /Sorting \(Sıralama\) kategorisini/i });
    expect(sortingToggleBtn.getAttribute('aria-expanded')).toBe('true');
    expect(screen.getByRole('button', { name: /Bubble Sort/i })).toBeDefined();

    // Tıkla -> Daralt (Collapse)
    fireEvent.click(sortingToggleBtn);
    expect(sortingToggleBtn.getAttribute('aria-expanded')).toBe('false');
    expect(screen.queryByRole('button', { name: /Bubble Sort/i })).toBeNull();

    // Yeniden tıkla -> Genişlet (Expand)
    fireEvent.click(sortingToggleBtn);
    expect(sortingToggleBtn.getAttribute('aria-expanded')).toBe('true');
    expect(screen.getByRole('button', { name: /Bubble Sort/i })).toBeDefined();
  });

  it('Seçili algoritmanın kategorisi otomatik olarak açık olmalı', () => {
    const onSelectAlgorithm = vi.fn();
    const { rerender } = render(
      <Sidebar selectedAlgoId="bubble-sort" onSelectAlgorithm={onSelectAlgorithm} />
    );

    const searchingToggleBtn = screen.getByRole('button', { name: /Searching \(Arama\) kategorisini/i });

    // Searching kategorisini manuel daralt
    fireEvent.click(searchingToggleBtn);
    expect(searchingToggleBtn.getAttribute('aria-expanded')).toBe('false');

    // selectedAlgoId searching kategorisine ait bir id olarak rerender edildiğinde kategori otomatik açılmalı
    rerender(<Sidebar selectedAlgoId="linear-search" onSelectAlgorithm={onSelectAlgorithm} />);
    expect(searchingToggleBtn.getAttribute('aria-expanded')).toBe('true');
  });

  it('sidebar-nav bağımsız scroll kapsayıcısı olarak doğru render edilmeli', () => {
    const onSelectAlgorithm = vi.fn();
    const { container } = render(
      <Sidebar selectedAlgoId="bubble-sort" onSelectAlgorithm={onSelectAlgorithm} />
    );

    const nav = container.querySelector('.sidebar-nav');
    expect(nav).not.toBeNull();

    const title = container.querySelector('.sidebar-section-title');
    expect(title?.textContent).toBe('KATEGORİLER');
  });
});
