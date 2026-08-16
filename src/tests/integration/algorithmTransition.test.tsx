import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { vi, describe, it, expect, beforeEach, afterEach } from 'vitest';
import { App } from '../../App';

describe('Algorithm Transition & State Isolation Integration Tests', () => {
  beforeEach(() => {
    vi.useFakeTimers({ shouldAdvanceTime: true });
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  describe('1. Graph -> Sorting & Searching Transitions (No Black Screen & Correct Visualizer)', () => {
    it('BFS -> Bubble Sort geçişinde siyah ekran oluşmamalı, GraphVisualizer kalkmalı ve ArrayVisualizer (barlar) render edilmeli', async () => {
      const user = userEvent.setup({ advanceTimers: vi.advanceTimersByTime });
      const { container } = render(<App />);

      const bfsBtn = screen.getByText(/BFS/i).closest('button');
      expect(bfsBtn).not.toBeNull();
      await user.click(bfsBtn!);
      expect(container.querySelector('.graph-visualizer-container')).not.toBeNull();

      const bubbleBtn = screen.getByText(/Bubble Sort/i).closest('button');
      expect(bubbleBtn).not.toBeNull();
      await user.click(bubbleBtn!);

      expect(container.querySelector('.graph-visualizer-container')).toBeNull();
      expect(container.querySelectorAll('.bar').length).toBeGreaterThan(0);
      expect(screen.getByRole('heading', { level: 3, name: 'Görsel Simülasyon' })).toBeDefined();
    });

    it('BFS -> Linear Search geçişinde siyah ekran oluşmamalı ve SearchVisualizer render edilmeli', async () => {
      const user = userEvent.setup({ advanceTimers: vi.advanceTimersByTime });
      const { container } = render(<App />);

      const bfsBtn = screen.getByText(/BFS/i).closest('button');
      await user.click(bfsBtn!);

      const linearBtn = screen.getByText(/Linear Search/i).closest('button');
      await user.click(linearBtn!);

      expect(container.querySelector('.graph-visualizer-container')).toBeNull();
      expect(container.querySelector('.search-visualizer-card')).not.toBeNull();
    });

    it('BFS -> Binary Search geçişinde siyah ekran oluşmamalı ve SearchVisualizer render edilmeli', async () => {
      const user = userEvent.setup({ advanceTimers: vi.advanceTimersByTime });
      const { container } = render(<App />);

      const bfsBtn = screen.getByText(/BFS/i).closest('button');
      await user.click(bfsBtn!);

      const binaryBtn = screen.getByText(/Binary Search/i).closest('button');
      await user.click(binaryBtn!);

      expect(container.querySelector('.graph-visualizer-container')).toBeNull();
      expect(container.querySelector('.search-visualizer-card')).not.toBeNull();
    });

    it('DFS -> Selection Sort geçişinde siyah ekran oluşmamalı ve ArrayVisualizer render edilmeli', async () => {
      const user = userEvent.setup({ advanceTimers: vi.advanceTimersByTime });
      const { container } = render(<App />);

      const dfsBtn = screen.getByText(/DFS/i).closest('button');
      await user.click(dfsBtn!);
      expect(container.querySelector('.graph-visualizer-container')).not.toBeNull();

      const selectBtn = screen.getByText(/Selection Sort/i).closest('button');
      await user.click(selectBtn!);

      expect(container.querySelector('.graph-visualizer-container')).toBeNull();
      expect(container.querySelectorAll('.bar').length).toBeGreaterThan(0);
    });

    it('DFS -> Linear Search geçişinde siyah ekran oluşmamalı ve SearchVisualizer render edilmeli', async () => {
      const user = userEvent.setup({ advanceTimers: vi.advanceTimersByTime });
      const { container } = render(<App />);

      const dfsBtn = screen.getByText(/DFS/i).closest('button');
      await user.click(dfsBtn!);

      const linearBtn = screen.getByText(/Linear Search/i).closest('button');
      await user.click(linearBtn!);

      expect(container.querySelector('.graph-visualizer-container')).toBeNull();
      expect(container.querySelector('.search-visualizer-card')).not.toBeNull();
    });

    it('DFS -> Binary Search geçişinde siyah ekran oluşmamalı ve SearchVisualizer render edilmeli', async () => {
      const user = userEvent.setup({ advanceTimers: vi.advanceTimersByTime });
      const { container } = render(<App />);

      const dfsBtn = screen.getByText(/DFS/i).closest('button');
      await user.click(dfsBtn!);

      const binaryBtn = screen.getByText(/Binary Search/i).closest('button');
      await user.click(binaryBtn!);

      expect(container.querySelector('.graph-visualizer-container')).toBeNull();
      expect(container.querySelector('.search-visualizer-card')).not.toBeNull();
    });
  });

  describe('2. Array -> Graph & Graph -> Graph Transitions', () => {
    it('Bubble Sort -> BFS geçişinde GraphVisualizer açılmalı', async () => {
      const user = userEvent.setup({ advanceTimers: vi.advanceTimersByTime });
      const { container } = render(<App />);

      const bfsBtn = screen.getByText(/BFS/i).closest('button');
      await user.click(bfsBtn!);

      expect(container.querySelector('.graph-visualizer-container')).not.toBeNull();
      expect(container.querySelectorAll('.bar').length).toBe(0);
    });

    it('Linear Search -> BFS geçişinde GraphVisualizer açılmalı ve arama hedefi sıfırlanmalı', async () => {
      const user = userEvent.setup({ advanceTimers: vi.advanceTimersByTime });
      const { container } = render(<App />);

      const linearBtn = screen.getByText(/Linear Search/i).closest('button');
      await user.click(linearBtn!);
      expect(container.querySelector('.search-visualizer-card')).not.toBeNull();

      const bfsBtn = screen.getByText(/BFS/i).closest('button');
      await user.click(bfsBtn!);

      expect(container.querySelector('.search-visualizer-card')).toBeNull();
      expect(container.querySelector('.graph-visualizer-container')).not.toBeNull();
    });

    it('BFS -> DFS ve DFS -> BFS geçişleri sorunsuz çalışmalı', async () => {
      const user = userEvent.setup({ advanceTimers: vi.advanceTimersByTime });
      render(<App />);

      // BFS
      const bfsBtn = screen.getByText(/BFS/i).closest('button');
      await user.click(bfsBtn!);
      expect(screen.getByText(/BFS KUYRUK/i)).toBeDefined();

      // DFS
      const dfsBtn = screen.getByText(/DFS/i).closest('button');
      await user.click(dfsBtn!);
      expect(screen.getByText(/DFS YIĞIN/i)).toBeDefined();

      // Tekrar BFS
      await user.click(bfsBtn!);
      expect(screen.getByText(/BFS KUYRUK/i)).toBeDefined();
    });
  });

  describe('3. State Leakage Prevention Tests', () => {
    it('BFS -> Bubble Sort geçişinde Queue/Stack çekmece paneli kesinlikle sızmamalı ve render edilmemeli', async () => {
      const user = userEvent.setup({ advanceTimers: vi.advanceTimersByTime });
      const { container } = render(<App />);

      const bfsBtn = screen.getByText(/BFS/i).closest('button');
      await user.click(bfsBtn!);
      expect(container.querySelector('.queue-drawer-panel')).not.toBeNull();

      const bubbleBtn = screen.getByText(/Bubble Sort/i).closest('button');
      await user.click(bubbleBtn!);

      expect(container.querySelector('.queue-drawer-panel')).toBeNull();
      expect(container.querySelector('.graph-svg-wrapper')).toBeNull();
    });

    it('BFS -> Linear Search geçişinde Graf düğüm/kenar state\'leri SearchVisualizer\'a sızmamalı', async () => {
      const user = userEvent.setup({ advanceTimers: vi.advanceTimersByTime });
      const { container } = render(<App />);

      const bfsBtn = screen.getByText(/BFS/i).closest('button');
      await user.click(bfsBtn!);

      const linearBtn = screen.getByText(/Linear Search/i).closest('button');
      await user.click(linearBtn!);

      expect(container.querySelector('.graph-svg-wrapper')).toBeNull();
      expect(container.querySelector('.queue-drawer-panel')).toBeNull();
      expect(container.querySelectorAll('.search-card-wrapper').length).toBeGreaterThan(0);
    });
  });
});
