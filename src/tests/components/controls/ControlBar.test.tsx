import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { vi, describe, it, expect } from 'vitest';
import { ControlBar } from '../../../components/controls/ControlBar';
import type { DataPreset } from '../../../utils/arrayGenerator';

describe('ControlBar UI Component Unit & Behavior Tests', () => {
  const defaultProps = {
    isPlaying: false,
    speed: 1,
    arraySize: 12,
    preset: 'random' as DataPreset,
    currentStepIdx: 0,
    totalSteps: 10,
    onTogglePlay: vi.fn(),
    onStepForward: vi.fn(),
    onStepBackward: vi.fn(),
    onRestart: vi.fn(),
    onSetSpeed: vi.fn(),
    onSetArraySize: vi.fn(),
    onGenerateData: vi.fn(),
  };

  const createProps = (override = {}) => ({
    ...defaultProps,
    onTogglePlay: vi.fn(),
    onStepForward: vi.fn(),
    onStepBackward: vi.fn(),
    onRestart: vi.fn(),
    onSetSpeed: vi.fn(),
    onSetArraySize: vi.fn(),
    onGenerateData: vi.fn(),
    ...override,
  });

  describe('1. Navigation Buttons & Disabled State', () => {
    it('currentStepIdx = 0 iken Önceki Adım butonu disabled, Sonraki Adım aktif olmalı', () => {
      render(<ControlBar {...createProps({ currentStepIdx: 0, totalSteps: 10 })} />);

      const prevBtn = screen.getByRole('button', { name: /önceki adım/i }) as HTMLButtonElement;
      const nextBtn = screen.getByRole('button', { name: /sonraki adım/i }) as HTMLButtonElement;

      expect(prevBtn.disabled).toBe(true);
      expect(nextBtn.disabled).toBe(false);
    });

    it('currentStepIdx > 0 ve son adım değilken her iki adım butonu da aktif olmalı', () => {
      render(<ControlBar {...createProps({ currentStepIdx: 4, totalSteps: 10 })} />);

      const prevBtn = screen.getByRole('button', { name: /önceki adım/i }) as HTMLButtonElement;
      const nextBtn = screen.getByRole('button', { name: /sonraki adım/i }) as HTMLButtonElement;

      expect(prevBtn.disabled).toBe(false);
      expect(nextBtn.disabled).toBe(false);
    });

    it('currentStepIdx son adımda (totalSteps - 1) iken Sonraki Adım disabled olmalı', () => {
      render(<ControlBar {...createProps({ currentStepIdx: 9, totalSteps: 10 })} />);

      const prevBtn = screen.getByRole('button', { name: /önceki adım/i }) as HTMLButtonElement;
      const nextBtn = screen.getByRole('button', { name: /sonraki adım/i }) as HTMLButtonElement;

      expect(prevBtn.disabled).toBe(false);
      expect(nextBtn.disabled).toBe(true);
    });

    it('Edge Case: totalSteps = 1 iken hem Önceki hem Sonraki Adım disabled olmalı', () => {
      render(<ControlBar {...createProps({ currentStepIdx: 0, totalSteps: 1 })} />);

      const prevBtn = screen.getByRole('button', { name: /önceki adım/i }) as HTMLButtonElement;
      const nextBtn = screen.getByRole('button', { name: /sonraki adım/i }) as HTMLButtonElement;

      expect(prevBtn.disabled).toBe(true);
      expect(nextBtn.disabled).toBe(true);
    });
  });

  describe('2. Play / Pause Button State & Behavior', () => {
    it('isPlaying = false iken Oynat metni görünmeli ve tıklanınca onTogglePlay çağrılmalı', async () => {
      const user = userEvent.setup();
      const props = createProps({ isPlaying: false });
      render(<ControlBar {...props} />);

      const playBtn = screen.getByRole('button', { name: /oynat/i });
      expect(playBtn).toBeDefined();
      expect(playBtn.classList.contains('playing')).toBe(false);

      await user.click(playBtn);

      expect(props.onTogglePlay).toHaveBeenCalledTimes(1);
      expect(props.onStepForward).not.toHaveBeenCalled();
      expect(props.onStepBackward).not.toHaveBeenCalled();
    });

    it('isPlaying = true iken Durdur metni ve playing sınıfı görünmeli, tıklanınca onTogglePlay çağrılmalı', async () => {
      const user = userEvent.setup();
      const props = createProps({ isPlaying: true });
      render(<ControlBar {...props} />);

      const pauseBtn = screen.getByRole('button', { name: /durdur/i });
      expect(pauseBtn).toBeDefined();
      expect(pauseBtn.classList.contains('playing')).toBe(true);

      await user.click(pauseBtn);

      expect(props.onTogglePlay).toHaveBeenCalledTimes(1);
    });
  });

  describe('3. Step & Navigation Callbacks Isolation', () => {
    it('Önceki Adım tıklanınca sadece onStepBackward çağrılmalı', async () => {
      const user = userEvent.setup();
      const props = createProps({ currentStepIdx: 3, totalSteps: 10 });
      render(<ControlBar {...props} />);

      const prevBtn = screen.getByRole('button', { name: /önceki adım/i });
      await user.click(prevBtn);

      expect(props.onStepBackward).toHaveBeenCalledTimes(1);
      expect(props.onStepForward).not.toHaveBeenCalled();
      expect(props.onTogglePlay).not.toHaveBeenCalled();
      expect(props.onRestart).not.toHaveBeenCalled();
    });

    it('Sonraki Adım tıklanınca sadece onStepForward çağrılmalı', async () => {
      const user = userEvent.setup();
      const props = createProps({ currentStepIdx: 3, totalSteps: 10 });
      render(<ControlBar {...props} />);

      const nextBtn = screen.getByRole('button', { name: /sonraki adım/i });
      await user.click(nextBtn);

      expect(props.onStepForward).toHaveBeenCalledTimes(1);
      expect(props.onStepBackward).not.toHaveBeenCalled();
      expect(props.onTogglePlay).not.toHaveBeenCalled();
      expect(props.onRestart).not.toHaveBeenCalled();
    });

    it('Sıfırla (Restart) tıklanınca sadece onRestart çağrılmalı', async () => {
      const user = userEvent.setup();
      const props = createProps({ currentStepIdx: 5, totalSteps: 10 });
      render(<ControlBar {...props} />);

      const restartBtn = screen.getByRole('button', { name: /sıfırla/i });
      await user.click(restartBtn);

      expect(props.onRestart).toHaveBeenCalledTimes(1);
      expect(props.onStepForward).not.toHaveBeenCalled();
      expect(props.onStepBackward).not.toHaveBeenCalled();
    });
  });

  describe('4. Speed Control & Pill Selection', () => {
    it('Tüm hız seçenekleri (0.25x, 0.5x, 1x, 2x, 4x) doğru render edilmeli', () => {
      render(<ControlBar {...createProps({ speed: 1 })} />);

      const speeds = ['0.25x', '0.5x', '1x', '2x', '4x'];
      speeds.forEach((s) => {
        expect(screen.getByRole('button', { name: s })).toBeDefined();
      });
    });

    it('Seçili hız butonunun active sınıfına sahip olması doğrulanmalı', () => {
      render(<ControlBar {...createProps({ speed: 2 })} />);

      const speed2xBtn = screen.getByRole('button', { name: '2x' });
      const speed1xBtn = screen.getByRole('button', { name: '1x' });

      expect(speed2xBtn.classList.contains('active')).toBe(true);
      expect(speed1xBtn.classList.contains('active')).toBe(false);
    });

    it('2x hız butonuna tıklandığında onSetSpeed(2) çağrılmalı', async () => {
      const user = userEvent.setup();
      const props = createProps({ speed: 1 });
      render(<ControlBar {...props} />);

      const speed2xBtn = screen.getByRole('button', { name: '2x' });
      await user.click(speed2xBtn);

      expect(props.onSetSpeed).toHaveBeenCalledWith(2);
      expect(props.onTogglePlay).not.toHaveBeenCalled();
    });
  });

  describe('5. Custom Array Modal Interactions & Input Validation', () => {
    it('TEST 1: Özel Dizi Girin butonuna basıldığında modal açılmalı, Vazgeç basılınca onGenerateData çağrılmadan kapanmalı', async () => {
      const user = userEvent.setup();
      const props = createProps();
      render(<ControlBar {...props} />);

      const customTriggerBtn = screen.getByRole('button', { name: /özel dizi girin/i });
      await user.click(customTriggerBtn);

      expect(screen.getByRole('heading', { level: 3, name: /özel dizi girin/i })).toBeDefined();
      expect(screen.getByPlaceholderText(/8, 3, 5, 1/i)).toBeDefined();

      const cancelBtn = screen.getByRole('button', { name: /vazgeç/i });
      await user.click(cancelBtn);

      expect(screen.queryByRole('heading', { level: 3, name: /özel dizi girin/i })).toBeNull();
      expect(props.onGenerateData).not.toHaveBeenCalled();
    });

    it('TEST 2: Modal içerisinde boş veya geçersiz girdi verildiğinde hata gösterilmeli ve onGenerateData çağrılmamalı', async () => {
      const user = userEvent.setup();
      const props = createProps();
      render(<ControlBar {...props} />);

      await user.click(screen.getByRole('button', { name: /özel dizi girin/i }));

      const textarea = screen.getByPlaceholderText(/8, 3, 5, 1/i);
      await user.clear(textarea);
      await user.type(textarea, '   ,  ;  abc  ');

      const submitBtn = screen.getByRole('button', { name: /diziyi uygula/i });
      await user.click(submitBtn);

      expect(screen.getByText(/geçerli sayılar girin/i)).toBeDefined();
      expect(props.onGenerateData).not.toHaveBeenCalled();
    });

    it('TEST 3: Modal içerisinde 50den fazla eleman girildiğinde maksimum sınır hatası verilmeli ve modal açık kalmalı', async () => {
      const user = userEvent.setup();
      const props = createProps();
      render(<ControlBar {...props} />);

      await user.click(screen.getByRole('button', { name: /özel dizi girin/i }));

      const textarea = screen.getByPlaceholderText(/8, 3, 5, 1/i);
      await user.clear(textarea);

      const fiftyOneNumbers = Array.from({ length: 51 }, (_, i) => i + 1).join(', ');
      await user.type(textarea, fiftyOneNumbers);

      const submitBtn = screen.getByRole('button', { name: /diziyi uygula/i });
      await user.click(submitBtn);

      expect(screen.getByText(/maksimum 50 eleman/i)).toBeDefined();
      expect(props.onGenerateData).not.toHaveBeenCalled();
      expect(screen.getByRole('heading', { level: 3, name: /özel dizi girin/i })).toBeDefined();
    });

    it('TEST 4: Geçerli özel dizi girildiğinde onGenerateData custom ve parsed array ile tam 1 kez çağrılmalı', async () => {
      const user = userEvent.setup();
      const props = createProps();
      render(<ControlBar {...props} />);

      await user.click(screen.getByRole('button', { name: /özel dizi girin/i }));

      const textarea = screen.getByPlaceholderText(/8, 3, 5, 1/i);
      await user.clear(textarea);
      await user.type(textarea, '5, 2, 8, 1, 4');

      const submitBtn = screen.getByRole('button', { name: /diziyi uygula/i });
      await user.click(submitBtn);

      expect(props.onGenerateData).toHaveBeenCalledTimes(1);
      expect(props.onGenerateData).toHaveBeenCalledWith('custom', [5, 2, 8, 1, 4]);
      expect(screen.queryByRole('heading', { level: 3, name: /özel dizi girin/i })).toBeNull();
    });
  });

  describe('9. Compact Preset Design & Segmented Pill Group (P1-B)', () => {
    it('Preset butonları role="group" içinde segmented-pill yapısında doğru active durumlara sahip olmalı', () => {
      const props = createProps({ preset: 'sorted' });
      const { container } = render(<ControlBar {...props} />);

      const presetGroup = container.querySelector('.preset-buttons');
      expect(presetGroup).toBeDefined();

      const sortedBtn = screen.getByRole('button', { name: 'Sıralı' });
      expect(sortedBtn.getAttribute('aria-pressed')).toBe('true');
      expect(sortedBtn.className).toContain('active');

      const randomBtn = screen.getByRole('button', { name: /Rastgele/i });
      expect(randomBtn.getAttribute('aria-pressed')).toBe('false');
    });

    it('Farklı preset butonlarına tıklandığında ilgili onGenerateData preset ID ile çağrılmalı', async () => {
      const user = userEvent.setup();
      const props = createProps();
      render(<ControlBar {...props} />);

      await user.click(screen.getByRole('button', { name: 'Ters Sıralı' }));
      expect(props.onGenerateData).toHaveBeenCalledWith('reverse');

      await user.click(screen.getByRole('button', { name: 'Tekrarlı' }));
      expect(props.onGenerateData).toHaveBeenCalledWith('duplicates');
    });
  });
});
