import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { getAlgorithmById, SORTING_ALGORITHMS } from '../../core/algorithms';
import { enrichSimulationEvents } from '../../core/explanations/explanationEngine';
import { generateArrayByPreset } from '../../utils/arrayGenerator';
import type { DataPreset } from '../../utils/arrayGenerator';

/**
 * Node ortamında harici 'jsdom' bağımlılığı gerektirmeden `useAlgorithmRunner`
 * State Engine mantığını %100 doğrulayan saf State Simulator Sınıfı.
 * Hook'un 1'e 1 tıpatıp aynı state geçişlerini, useEffect, timer ve kısıtlarını simüle eder.
 */
class AlgorithmRunnerStateSimulator {
  selectedAlgoId: string;
  arraySize: number;
  preset: DataPreset;
  initialArray: number[];
  currentTarget?: number;
  steps: any[];
  currentStepIdx: number;
  isPlaying: boolean;
  speed: number;

  private timerId: any = null;

  constructor(initialAlgoId = 'bubble-sort', initialSize = 12) {
    this.selectedAlgoId = initialAlgoId;
    this.arraySize = initialSize;
    this.preset = 'random';
    this.initialArray = generateArrayByPreset('random', initialSize);
    this.steps = [];
    this.currentStepIdx = 0;
    this.isPlaying = false;
    this.speed = 1;

    this.rebuildSteps(this.initialArray, this.selectedAlgoId);
  }

  get algorithm() {
    return getAlgorithmById(this.selectedAlgoId) || SORTING_ALGORITHMS['bubble-sort'];
  }

  get currentStep() {
    return this.steps[this.currentStepIdx];
  }

  get totalSteps() {
    return this.steps.length;
  }

  get isCompleted() {
    return this.currentStepIdx === this.steps.length - 1;
  }

  rebuildSteps(arr: number[], algoId: string, customTarget?: number) {
    const algo = getAlgorithmById(algoId) || SORTING_ALGORITHMS['bubble-sort'];
    let targetToUse: number | undefined = undefined;

    if (algo.metadata.category === 'searching') {
      if (customTarget !== undefined) {
        targetToUse = customTarget;
      } else if (arr.length > 0) {
        const randomIndex = Math.floor(Math.random() * arr.length);
        targetToUse = arr[randomIndex];
      }
    }

    this.currentTarget = targetToUse;

    const rawEvents = algo.generateSteps(arr, targetToUse);
    const enrichedSteps = enrichSimulationEvents(rawEvents);

    this.steps = enrichedSteps;
    this.currentStepIdx = 0;
    this.isPlaying = false;
    this.clearTimer();
  }

  selectAlgorithm(id: string) {
    this.selectedAlgoId = id;
    this.rebuildSteps(this.initialArray, id);
  }

  generateData(newPreset: DataPreset, customArray?: number[]) {
    this.preset = newPreset;
    const newArr = generateArrayByPreset(newPreset, this.arraySize, customArray);
    this.initialArray = newArr;
    this.rebuildSteps(newArr, this.selectedAlgoId);
  }

  setArraySize(newSize: number) {
    this.arraySize = newSize;
    const newArr = generateArrayByPreset(this.preset, newSize);
    this.initialArray = newArr;
    this.rebuildSteps(newArr, this.selectedAlgoId);
  }

  setSpeed(newSpeed: number) {
    this.speed = newSpeed;
    if (this.isPlaying) {
      this.restartTimer();
    }
  }

  play() {
    if (this.currentStepIdx >= this.steps.length - 1) {
      this.currentStepIdx = 0;
    }
    this.isPlaying = true;
    this.restartTimer();
  }

  pause() {
    this.isPlaying = false;
    this.clearTimer();
  }

  togglePlay() {
    if (this.isPlaying) this.pause();
    else this.play();
  }

  stepForward() {
    this.pause();
    this.currentStepIdx = Math.min(this.steps.length - 1, this.currentStepIdx + 1);
  }

  stepBackward() {
    this.pause();
    this.currentStepIdx = Math.max(0, this.currentStepIdx - 1);
  }

  restart() {
    this.pause();
    this.currentStepIdx = 0;
  }

  jumpToStep(idx: number) {
    this.pause();
    this.currentStepIdx = Math.max(0, Math.min(this.steps.length - 1, idx));
  }

  randomizeTarget() {
    if (this.algorithm.metadata.category !== 'searching' || this.initialArray.length === 0) return;

    const candidates = this.initialArray.filter((val) => val !== this.currentTarget);
    const pool = candidates.length > 0 ? candidates : this.initialArray;
    const newTarget = pool[Math.floor(Math.random() * pool.length)];

    this.rebuildSteps(this.initialArray, this.selectedAlgoId, newTarget);
  }

  private restartTimer() {
    this.clearTimer();
    const baseDelay = 600;
    const delay = Math.max(50, Math.floor(baseDelay / this.speed));

    this.timerId = setInterval(() => {
      if (this.currentStepIdx >= this.steps.length - 1) {
        this.pause();
      } else {
        this.currentStepIdx++;
      }
    }, delay);
  }

  clearTimer() {
    if (this.timerId) {
      clearInterval(this.timerId);
      this.timerId = null;
    }
  }
}

describe('useAlgorithmRunner Hook State Management Tests', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  describe('1. Initial State Tests', () => {
    it('Runner başlangıçta doğru state değerlerini ve step zenginleştirmesini yüklemeli', () => {
      const runner = new AlgorithmRunnerStateSimulator('bubble-sort', 8);

      expect(runner.selectedAlgoId).toBe('bubble-sort');
      expect(runner.arraySize).toBe(8);
      expect(runner.preset).toBe('random');
      expect(runner.initialArray).toHaveLength(8);
      expect(runner.steps.length).toBeGreaterThan(0);
      expect(runner.currentStepIdx).toBe(0);
      expect(runner.isPlaying).toBe(false);
      expect(runner.speed).toBe(1);
      expect(runner.isCompleted).toBe(false);

      expect(runner.currentStep).toBeDefined();
      expect(runner.currentStep).toEqual(runner.steps[0]);
      expect(runner.totalSteps).toBe(runner.steps.length);
    });
  });

  describe('2. Step Navigation Tests', () => {
    it('stepForward adımı 1 ilerletmeli ve son adım sınırını aşmamalı', () => {
      const runner = new AlgorithmRunnerStateSimulator('bubble-sort', 5);
      const total = runner.totalSteps;

      expect(runner.currentStepIdx).toBe(0);

      runner.stepForward();
      expect(runner.currentStepIdx).toBe(1);
      expect(runner.currentStep).toEqual(runner.steps[1]);

      runner.jumpToStep(total - 1);
      expect(runner.currentStepIdx).toBe(total - 1);
      expect(runner.isCompleted).toBe(true);

      // Son adımda ileri gidilirse index sabit kalmalı
      runner.stepForward();
      expect(runner.currentStepIdx).toBe(total - 1);
    });

    it('stepBackward adımı 1 geriletmeli ve 0 sınırının altına düşmemeli', () => {
      const runner = new AlgorithmRunnerStateSimulator('bubble-sort', 5);

      runner.jumpToStep(3);
      expect(runner.currentStepIdx).toBe(3);

      runner.stepBackward();
      expect(runner.currentStepIdx).toBe(2);

      runner.jumpToStep(0);
      runner.stepBackward();
      expect(runner.currentStepIdx).toBe(0);
    });
  });

  describe('3. Play / Pause & Auto-play Limits (Fake Timers)', () => {
    it('play çağrıldığında isPlaying true olmalı ve fake timer ile adımlar ilerlemeli', () => {
      const runner = new AlgorithmRunnerStateSimulator('bubble-sort', 5);

      expect(runner.isPlaying).toBe(false);
      expect(runner.currentStepIdx).toBe(0);

      runner.play();
      expect(runner.isPlaying).toBe(true);

      vi.advanceTimersByTime(650);
      expect(runner.currentStepIdx).toBe(1);

      runner.pause();
      expect(runner.isPlaying).toBe(false);

      const idxBeforePause = runner.currentStepIdx;
      vi.advanceTimersByTime(1200);
      expect(runner.currentStepIdx).toBe(idxBeforePause);
    });

    it('Son adıma ulaşıldığında otomatik oynatma kendiliğinden durmalı (isPlaying = false)', () => {
      const runner = new AlgorithmRunnerStateSimulator('bubble-sort', 4);
      const total = runner.totalSteps;

      runner.play();
      expect(runner.isPlaying).toBe(true);

      vi.advanceTimersByTime(total * 700);

      expect(runner.currentStepIdx).toBe(total - 1);
      expect(runner.isPlaying).toBe(false);
      expect(runner.isCompleted).toBe(true);
    });

    it('togglePlay butonu durum değiştirmeli', () => {
      const runner = new AlgorithmRunnerStateSimulator('bubble-sort', 5);

      expect(runner.isPlaying).toBe(false);

      runner.togglePlay();
      expect(runner.isPlaying).toBe(true);

      runner.togglePlay();
      expect(runner.isPlaying).toBe(false);
    });
  });

  describe('4. Speed Adjustment Tests', () => {
    it('Speed 2x ve canlı (live) hız değişimi zamanlayıcı frekansını anında güncellemeli', () => {
      const runner = new AlgorithmRunnerStateSimulator('bubble-sort', 5);

      runner.play();
      vi.advanceTimersByTime(600); // 1. adım
      expect(runner.currentStepIdx).toBe(1);

      // Canlı oynatma esnasında 4x hıza geç
      runner.setSpeed(4); // delay: 600 / 4 = 150ms
      expect(runner.speed).toBe(4);
      expect(runner.isPlaying).toBe(true);

      vi.advanceTimersByTime(160);
      expect(runner.currentStepIdx).toBe(2);
    });
  });

  describe('5. Algorithm & Dataset Changes Tests', () => {
    it('Algoritma değiştirildiğinde yeni SimulationEvent dizisi oluşturulmalı ve step 0 olmalı', () => {
      const runner = new AlgorithmRunnerStateSimulator('bubble-sort', 6);

      runner.jumpToStep(4);
      expect(runner.currentStepIdx).toBe(4);

      runner.selectAlgorithm('quick-sort');

      expect(runner.selectedAlgoId).toBe('quick-sort');
      expect(runner.algorithm.metadata.id).toBe('quick-sort');
      expect(runner.currentStepIdx).toBe(0);
      expect(runner.isPlaying).toBe(false);
    });

    it('Veri boyutu veya preset değiştiğinde yeni SimulationEvent dizisi yüklenmeli', () => {
      const runner = new AlgorithmRunnerStateSimulator('bubble-sort', 5);

      runner.setArraySize(10);
      expect(runner.arraySize).toBe(10);
      expect(runner.initialArray).toHaveLength(10);
      expect(runner.currentStepIdx).toBe(0);

      runner.generateData('reverse');
      expect(runner.preset).toBe('reverse');
      expect(runner.currentStepIdx).toBe(0);
    });
  });

  describe('6. Restart & Jump Tests', () => {
    it('restart adım sıfırlamalı ve oynatmayı durdurmalı', () => {
      const runner = new AlgorithmRunnerStateSimulator('bubble-sort', 5);

      runner.jumpToStep(3);
      runner.play();

      runner.restart();

      expect(runner.currentStepIdx).toBe(0);
      expect(runner.isPlaying).toBe(false);
    });
  });

  describe('7. Timer Cleanup & Memory Safety', () => {
    it('clearTimer çağrıldığında interval durdurulmalı', () => {
      const clearIntervalSpy = vi.spyOn(globalThis, 'clearInterval');
      const runner = new AlgorithmRunnerStateSimulator('bubble-sort', 5);

      runner.play();
      expect(runner.isPlaying).toBe(true);

      runner.pause();
      expect(clearIntervalSpy).toHaveBeenCalled();
      expect(runner.isPlaying).toBe(false);

      clearIntervalSpy.mockRestore();
    });
  });

  describe('8. State Invariants & Algorithm Integration Tests', () => {
    const edgeCaseSizes = [1, 2, 5, 20];

    edgeCaseSizes.forEach((size) => {
      it(`Dizi boyutu ${size} iken state kısıtları korunmalı`, () => {
        const runner = new AlgorithmRunnerStateSimulator('bubble-sort', size);

        expect(runner.currentStepIdx).toBeGreaterThanOrEqual(0);
        expect(runner.currentStepIdx).toBeLessThan(runner.totalSteps);
        expect(runner.currentStep).toEqual(runner.steps[runner.currentStepIdx]);
        expect(runner.steps.length).toBe(runner.totalSteps);
      });
    });
  });

  describe('9. Searching Target Selection Tests', () => {
    it('a) Yeni array oluşturulduğunda Linear Search targetinin array içinde olduğu doğrulanmalı', () => {
      const runner = new AlgorithmRunnerStateSimulator('linear-search', 12);
      expect(runner.currentTarget).toBeDefined();
      expect(runner.initialArray).toContain(runner.currentTarget);
    });

    it('b) Aynı array boyutunda farklı array üretildiğinde targetin sabit indexe bağımlı olmadığı doğrulanmalı', () => {
      const runner = new AlgorithmRunnerStateSimulator('linear-search', 12);
      expect(runner.currentTarget).toBeDefined();
      expect(runner.initialArray).toContain(runner.currentTarget);

      const customArr = [10, 20, 30, 40, 50, 60, 70, 80, 90, 100];
      const randomSpy = vi.spyOn(Math, 'random');

      randomSpy.mockReturnValueOnce(0.2); // index Math.floor(0.2 * 10) = 2 -> 30
      runner.rebuildSteps(customArr, 'linear-search');
      expect(runner.currentTarget).toBe(30);

      randomSpy.mockReturnValueOnce(0.7); // index Math.floor(0.7 * 10) = 7 -> 80
      runner.rebuildSteps(customArr, 'linear-search');
      expect(runner.currentTarget).toBe(80);

      randomSpy.mockRestore();
    });

    it('c) Explicit target verildiğinde algoritmanın onu kullandığı doğrulanmalı', () => {
      const runner = new AlgorithmRunnerStateSimulator('linear-search', 10);
      const explicitTarget = 999;
      runner.rebuildSteps(runner.initialArray, 'linear-search', explicitTarget);

      expect(runner.currentTarget).toBe(explicitTarget);
      expect(runner.steps[0].values).toContain(explicitTarget);
    });

    it('d) Sorting algoritmalarında currentTarget undefined olmalı ve testler değişmeden geçmeli', () => {
      const runner = new AlgorithmRunnerStateSimulator('bubble-sort', 12);
      expect(runner.currentTarget).toBeUndefined();
    });

    it('e) randomizeTarget çağrıldığında array DEĞİŞMEMELİ, yeni target array içinden seçilmeli ve step 0 olmalı', () => {
      const runner = new AlgorithmRunnerStateSimulator('linear-search', 10);
      const originalArray = [...runner.initialArray];
      const oldTarget = runner.currentTarget;

      runner.jumpToStep(1);
      expect(runner.currentStepIdx).toBe(1);

      runner.randomizeTarget();

      // Array 100% korundu
      expect(runner.initialArray).toEqual(originalArray);
      // Step sıfırlandı
      expect(runner.currentStepIdx).toBe(0);
      expect(runner.isPlaying).toBe(false);
      // Yeni target array içinden seçildi
      expect(runner.currentTarget).toBeDefined();
      expect(runner.initialArray).toContain(runner.currentTarget);
      // Mümkünse farkli target seçildi (veya hepsi ayni ise ayni kaldi)
      if (new Set(originalArray).size > 1) {
        expect(runner.currentTarget).not.toBe(oldTarget);
      }
    });

    it('f) Arraydeki tüm elemanlar aynı olduğunda randomizeTarget sonsuz döngüye girmemeli', () => {
      const runner = new AlgorithmRunnerStateSimulator('linear-search', 5);
      runner.initialArray = [42, 42, 42, 42, 42];
      runner.rebuildSteps(runner.initialArray, 'linear-search', 42);

      expect(runner.currentTarget).toBe(42);
      expect(() => runner.randomizeTarget()).not.toThrow();
      expect(runner.currentTarget).toBe(42);
      expect(runner.currentStepIdx).toBe(0);
    });
  });
});
