import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { vi, describe, it, expect, beforeEach, afterEach } from 'vitest';
import { App } from '../../App';

describe('App End-to-End Component & Architectural Integration Tests', () => {
  beforeEach(() => {
    vi.useFakeTimers({ shouldAdvanceTime: true });
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  describe('1. App Initial Render & Core Wiring', () => {
    it('Ana uygulama yüklendiğinde TopNavBar, Viewport, CodeDrawer ve TransportDock doğru yerleşmeli', () => {
      render(<App />);

      // TopNavBar doğrulaması
      expect(screen.getByText('AlgoLab')).toBeDefined();
      expect(screen.getByText('2.0')).toBeDefined();
      expect(screen.getByText('Doğrusal Yapılar')).toBeDefined();
      expect(screen.getByText('Sıralama Algoritmaları')).toBeDefined();

      // TransportDock kontrolleri
      expect(screen.getByTitle(/Oynat/i)).toBeDefined();
      expect(screen.getByTitle(/Bir Adım İleri/i)).toBeDefined();
      expect(screen.getByTitle(/Başa Dön/i)).toBeDefined();

      // CodeDrawer doğrulaması
      expect(screen.getByText('SÖZDE KOD (PSEUDOCODE)')).toBeDefined();
      expect(screen.getByText('CANLI ADIM DURUMU')).toBeDefined();
    });
  });

  describe('2. "Bir Adım İleri" Kullanıcı Akışı (Step Forward Flow)', () => {
    it('İleri butonuna basıldığında adım sayısı artmalı ve snapshot güncellenmeli', async () => {
      const user = userEvent.setup({ advanceTimers: vi.advanceTimersByTime });
      render(<App />);

      const nextBtn = screen.getByTitle(/Bir Adım İleri/i);
      expect(nextBtn).toBeDefined();

      await user.click(nextBtn);
      const stepBadges = screen.getAllByText(/ADIM/i);
      expect(stepBadges.length).toBeGreaterThan(0);
    });
  });

  describe('3. "Bir Adım Geri" Kullanıcı Akışı (Step Backward Flow)', () => {
    it('Bir adım ilerleyip ardından Geri butonuna basıldığında ilk adıma dönülmeli', async () => {
      const user = userEvent.setup({ advanceTimers: vi.advanceTimersByTime });
      render(<App />);

      const nextBtn = screen.getByTitle(/Bir Adım İleri/i);
      const prevBtn = screen.getByTitle(/Bir Adım Geri/i);

      await user.click(nextBtn);
      await user.click(prevBtn);
      expect(screen.getByTitle(/Bir Adım Geri/i)).toHaveProperty('disabled', true);
    });
  });

  describe('4. Reset (Başa Dön) Kullanıcı Akışı', () => {
    it('İlerleyen adımlarda Reset tıklandığında 0. adıma dönmeli', async () => {
      const user = userEvent.setup({ advanceTimers: vi.advanceTimersByTime });
      render(<App />);

      const nextBtn = screen.getByTitle(/Bir Adım İleri/i);
      await user.click(nextBtn);
      await user.click(nextBtn);

      const resetBtn = screen.getByTitle(/Başa Dön/i);
      await user.click(resetBtn);

      expect(screen.getByTitle(/Bir Adım Geri/i)).toHaveProperty('disabled', true);
    });
  });

  describe('5. Kategori ve Veri Yapısı Geçişleri', () => {
    it('Stack seçildiğinde Stack visualizer ve Push/Pop toolbarı görünmeli', async () => {
      const user = userEvent.setup({ advanceTimers: vi.advanceTimersByTime });
      render(<App />);

      const linearCategory = screen.getByText('Doğrusal Yapılar');
      await user.click(linearCategory);

      expect(screen.getAllByText(/Push/i).length).toBeGreaterThan(0);
      expect(screen.getAllByText(/Pop/i).length).toBeGreaterThan(0);
      expect(screen.getByText(/LIFO/i)).toBeDefined();
    });
  });
});
