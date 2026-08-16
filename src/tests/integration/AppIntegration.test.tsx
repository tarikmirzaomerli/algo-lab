import { render, screen, act } from '@testing-library/react';
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
    it('Ana uygulama yüklendiğinde Header, Sidebar, Visualizer, ControlBar ve StepExplanationPanel doğru yerleşmeli', () => {
      const { container } = render(<App />);

      // Header doğrulaması
      expect(screen.getByRole('heading', { level: 1, name: 'AlgoLab' })).toBeDefined();
      expect(screen.getByText('Eğitim Modu')).toBeDefined();

      // Sidebar doğrulaması
      expect(screen.getByText('KATEGORİLER')).toBeDefined();
      expect(screen.getByText(/Bubble Sort/i)).toBeDefined();

      // Visualizer doğrulaması
      expect(screen.getByRole('heading', { level: 3, name: 'Görsel Simülasyon' })).toBeDefined();

      // ControlBar doğrulaması
      expect(screen.getByRole('button', { name: /oynat/i })).toBeDefined();
      expect(screen.getByRole('button', { name: /önceki adım/i })).toBeDefined();
      expect(screen.getByRole('button', { name: /sonraki adım/i })).toBeDefined();

      // StepExplanationPanel doğrulaması (Gerçek Explanation Engine çıktısı)
      const counterText = container.querySelector('.counter-text')?.textContent;
      expect(counterText).toContain('Adım 1 /');
    });
  });

  describe('2. "Sonraki Adım" Kullanıcı Akışı (Next Step Flow)', () => {
    it('Sonraki Adım butonuna basıldığında state, visualizer ve explanation güncellenmeli', async () => {
      const user = userEvent.setup({ advanceTimers: vi.advanceTimersByTime });
      const { container } = render(<App />);

      const counterTextBefore = container.querySelector('.counter-text')?.textContent;
      expect(counterTextBefore).toContain('Adım 1 /');

      const nextBtn = screen.getByRole('button', { name: /sonraki adım/i });
      await user.click(nextBtn);

      const counterTextAfter = container.querySelector('.counter-text')?.textContent;
      expect(counterTextAfter).toContain('Adım 2 /');
    });
  });

  describe('3. "Önceki Adım" Kullanıcı Akışı (Previous Step Flow)', () => {
    it('Bir adım ilerleyip ardından Önceki Adım butonuna basıldığında ilk adıma dönülmeli', async () => {
      const user = userEvent.setup({ advanceTimers: vi.advanceTimersByTime });
      const { container } = render(<App />);

      const nextBtn = screen.getByRole('button', { name: /sonraki adım/i });
      const prevBtn = screen.getByRole('button', { name: /önceki adım/i });

      // 1 Adım İlerle (Adım 2'ye geç)
      await user.click(nextBtn);
      expect(container.querySelector('.counter-text')?.textContent).toContain('Adım 2 /');

      // 1 Adım Geri Gel (Adım 1'e dön)
      await user.click(prevBtn);
      expect(container.querySelector('.counter-text')?.textContent).toContain('Adım 1 /');
    });
  });

  describe('4. Oynat / Durdur Akışı (Play / Pause Flow with Fake Timers)', () => {
    it('Oynat butonuna basıldığında durum Durdur olmalı ve timer ile adımlar otomatik ilerlemeli', async () => {
      const user = userEvent.setup({ advanceTimers: vi.advanceTimersByTime });
      const { container } = render(<App />);

      const playBtn = screen.getByRole('button', { name: /oynat/i });
      await user.click(playBtn);

      // Buton "Durdur" haline gelmeli
      expect(screen.getByRole('button', { name: /durdur/i })).toBeDefined();

      // 1300 ms zaman ilerlet (~2 adım ilerleme) act() ve advanceTimersByTimeAsync ile sarmala
      await act(async () => {
        await vi.advanceTimersByTimeAsync(1300);
      });

      const counterText = container.querySelector('.counter-text')?.textContent;
      expect(counterText).not.toContain('Adım 1 /');

      // Durdur butonuna basılınca otomatik oynatma bitmeli
      const pauseBtn = screen.getByRole('button', { name: /durdur/i });
      await user.click(pauseBtn);

      expect(screen.getByRole('button', { name: /oynat/i })).toBeDefined();
    });
  });

  describe('5. Algoritma Değiştirme Akışı (Sidebar Selection Flow)', () => {
    it('Sidebar üzerinden Quick Sort seçildiğinde tüm zincir yeni algoritma ile sıfırlanmalı', async () => {
      const user = userEvent.setup({ advanceTimers: vi.advanceTimersByTime });
      const { container } = render(<App />);

      // Sidebar'da Quick Sort butonunu bul ve tıkla
      const quickSortBtn = screen.getByText(/Quick Sort/i).closest('button');
      expect(quickSortBtn).not.toBeNull();
      await user.click(quickSortBtn!);

      // Adımın 1'e sıfırlandığını ve Quick Sort başlığının ekrana geldiğini doğrula
      expect(container.querySelector('.counter-text')?.textContent).toContain('Adım 1 /');
      expect(container.querySelector('.step-title')?.textContent).toBeDefined();
    });
  });

  describe('6. Sıfırla Akışı (Restart Flow)', () => {
    it('Simülasyon birkaç adım ilerletilip Sıfırla butonuna basıldığında Adım 1e dönmeli', async () => {
      const user = userEvent.setup({ advanceTimers: vi.advanceTimersByTime });
      const { container } = render(<App />);

      const nextBtn = screen.getByRole('button', { name: /sonraki adım/i });
      await user.click(nextBtn);
      await user.click(nextBtn);

      expect(container.querySelector('.counter-text')?.textContent).toContain('Adım 3 /');

      const restartBtn = screen.getByRole('button', { name: /sıfırla/i });
      await user.click(restartBtn);

      expect(container.querySelector('.counter-text')?.textContent).toContain('Adım 1 /');
    });
  });

  describe('7. UI Üzerinden Adım Sınırları ve Disabled Durumları', () => {
    it('Başlangıçta Önceki Adım disabled olmalı', () => {
      render(<App />);

      const prevBtn = screen.getByRole('button', { name: /önceki adım/i }) as HTMLButtonElement;
      expect(prevBtn.disabled).toBe(true);
    });
  });

  describe('8. Sağ Panel Sekme Geçişi (Right Panel Tabs Flow)', () => {
    it('"Nasıl Çalışır?" sekmesine basıldığında InfoPanel, "Adım Anlatımı"na basıldığında StepExplanationPanel gösterilmeli', async () => {
      const user = userEvent.setup({ advanceTimers: vi.advanceTimersByTime });
      const { container } = render(<App />);

      // Başlangıçta StepExplanationPanel görünür
      expect(container.querySelector('.counter-text')?.textContent).toContain('Adım 1 /');

      // "Nasıl Çalışır? & Karmaşıklık" sekmesine tıkla
      const infoTabBtn = screen.getByRole('button', { name: /Nasıl Çalışır\?/i });
      await user.click(infoTabBtn);

      // InfoPanel gösterilmeli (Algoritma Nasıl Çalışır?)
      expect(screen.getByText('Algoritma Nasıl Çalışır?')).toBeDefined();
      expect(container.querySelector('.counter-text')).toBeNull();

      // Tekrar "Adım Anlatımı" sekmesine dön
      const stepTabBtn = screen.getByRole('button', { name: /Adım Anlatımı/i });
      await user.click(stepTabBtn);

      expect(container.querySelector('.counter-text')?.textContent).toContain('Adım 1 /');
    });
  });

  describe('9. Gerçek Explanation Engine & DOM Bağlantısı', () => {
    it('Gerçek SimulationEvent explanation metninin DOM üzerinde başlık ve açıklama olarak göründüğünü doğrula', () => {
      const { container } = render(<App />);

      const titleEl = container.querySelector('.step-title');
      const descEl = container.querySelector('.explanation-text');

      expect(titleEl).not.toBeNull();
      expect(descEl).not.toBeNull();
      expect(titleEl?.textContent?.length).toBeGreaterThan(3);
      expect(descEl?.textContent?.length).toBeGreaterThan(10);
    });
  });

  describe('10. Gerçek ArrayVisualizer & DOM Bağlantısı', () => {
    it('Gerçek algoritmanın initialArray ve step snapshot barlarının render edildiğini doğrula', () => {
      const { container } = render(<App />);

      // Varsayılan dizi boyutu 12 elemandır
      const bars = container.querySelectorAll('.bar');
      expect(bars).toHaveLength(12);
    });
  });

  describe('11. Live Speed Change & Array Preset/Size Reset (Final Hardening)', () => {
    it('TEST 5: Oynatma esnasında 4x hız seçildiğinde zamanlayıcı hızlanmalı ve aynı sürede daha fazla adım ilerlemeli', async () => {
      const user = userEvent.setup({ advanceTimers: vi.advanceTimersByTime });
      const { container } = render(<App />);

      // Oynat
      await user.click(screen.getByRole('button', { name: /oynat/i }));

      // 4x hız pill butonuna tıkla
      const speed4xBtn = screen.getByRole('button', { name: '4x' });
      await user.click(speed4xBtn);

      // 600 ms ilerlet (4x hızda delay = 150ms -> 600ms içinde ~4 adım ilerlemeli)
      await act(async () => {
        await vi.advanceTimersByTimeAsync(600);
      });

      const counterText = container.querySelector('.counter-text')?.textContent;
      expect(counterText).not.toContain('Adım 1 /');
      expect(counterText).not.toContain('Adım 2 /');
    });

    it('TEST 6: Adımlarda ilerlendikten sonra Preset veya Size değiştirildiğinde Adım 1e dönmeli ve Visualizer güncellenmeli', async () => {
      const user = userEvent.setup({ advanceTimers: vi.advanceTimersByTime });
      const { container } = render(<App />);

      const nextBtn = screen.getByRole('button', { name: /sonraki adım/i });
      await user.click(nextBtn);
      await user.click(nextBtn);

      expect(container.querySelector('.counter-text')?.textContent).toContain('Adım 3 /');

      // "Tekrarlı" preset butonuna tıkla
      const duplicatesBtn = screen.getByRole('button', { name: /tekrarlı/i });
      await user.click(duplicatesBtn);

      // Adımlar 1'e dönmeli ve barlar yerinde olmalı
      expect(container.querySelector('.counter-text')?.textContent).toContain('Adım 1 /');
      expect(container.querySelectorAll('.bar')).toHaveLength(12);
    });
  });
});
