import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { vi, describe, it, expect, beforeEach, afterEach } from 'vitest';
import { App } from '../../App';

describe('Algorithm & Structure Transition Integration Tests', () => {
  beforeEach(() => {
    vi.useFakeTimers({ shouldAdvanceTime: true });
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('Sorting -> Stack geçişinde Stack görselleştiricisi render edilmeli', async () => {
    const user = userEvent.setup({ advanceTimers: vi.advanceTimersByTime });
    render(<App />);

    const linearBtn = screen.getByText('Doğrusal Yapılar');
    await user.click(linearBtn);

    expect(screen.getByText(/LIFO/i)).toBeDefined();
    expect(screen.getAllByText(/Push/i).length).toBeGreaterThan(0);
  });

  it('Tree -> BST geçişinde BST ağaç kanvası ve traversalleri render edilmeli', async () => {
    const user = userEvent.setup({ advanceTimers: vi.advanceTimersByTime });
    render(<App />);

    const treeBtn = screen.getByText('Ağaç Yapıları');
    await user.click(treeBtn);

    expect(screen.getByText(/Sol < Kök < Sağ/i)).toBeDefined();
    expect(screen.getAllByText(/In-Order/i).length).toBeGreaterThan(0);
    expect(screen.getByText(/Pre-Order/i)).toBeDefined();
  });

  it('Searching -> Binary Search geçişinde sıralı dizi ve hedef gösterilmeli', async () => {
    const user = userEvent.setup({ advanceTimers: vi.advanceTimersByTime });
    render(<App />);

    const searchBtn = screen.getByText('Arama Algoritmaları');
    await user.click(searchBtn);

    expect(screen.getByText(/HEDEF:/i)).toBeDefined();
  });
});
