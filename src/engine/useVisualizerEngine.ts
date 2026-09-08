import { useState, useEffect, useRef, useCallback } from 'react';
import type { StepSnapshot } from './types';

export interface VisualizerEngineOptions {
  baseSpeedMs?: number;
  autoPlay?: boolean;
}

export function useVisualizerEngine<T = unknown>(
  initialSnapshots: StepSnapshot<T>[] = [],
  options: VisualizerEngineOptions = {}
) {
  const { baseSpeedMs = 650, autoPlay = false } = options;

  const [snapshots, setSnapshotsState] = useState<StepSnapshot<T>[]>(initialSnapshots);
  const [currentStepIdx, setCurrentStepIdx] = useState<number>(0);
  const [isPlaying, setIsPlaying] = useState<boolean>(autoPlay);
  const [speed, setSpeed] = useState<number>(1);
  const [isLooping, setIsLooping] = useState<boolean>(false);

  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const isPlayingRef = useRef<boolean>(isPlaying);
  isPlayingRef.current = isPlaying;

  const clearTimer = useCallback(() => {
    if (timerRef.current !== null) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }
  }, []);

  // Update snapshots and reset index safely
  const setSnapshots = useCallback((newSnapshots: StepSnapshot<T>[], startIndex = 0) => {
    clearTimer();
    setIsPlaying(false);
    setSnapshotsState(newSnapshots);
    setCurrentStepIdx(Math.max(0, Math.min(startIndex, Math.max(0, newSnapshots.length - 1))));
  }, [clearTimer]);

  const pause = useCallback(() => {
    clearTimer();
    setIsPlaying(false);
  }, [clearTimer]);

  const play = useCallback(() => {
    if (snapshots.length <= 1) return;
    setCurrentStepIdx((prev) => (prev >= snapshots.length - 1 ? 0 : prev));
    setIsPlaying(true);
  }, [snapshots.length]);

  const togglePlay = useCallback(() => {
    if (isPlaying) {
      pause();
    } else {
      play();
    }
  }, [isPlaying, pause, play]);

  const stepForward = useCallback(() => {
    pause();
    setCurrentStepIdx((prev) => Math.min(snapshots.length - 1, prev + 1));
  }, [snapshots.length, pause]);

  const stepBackward = useCallback(() => {
    pause();
    setCurrentStepIdx((prev) => Math.max(0, prev - 1));
  }, [pause]);

  const jumpToStep = useCallback(
    (stepIndex: number) => {
      pause();
      setCurrentStepIdx(Math.max(0, Math.min(snapshots.length - 1, stepIndex)));
    },
    [snapshots.length, pause]
  );

  const reset = useCallback(() => {
    pause();
    setCurrentStepIdx(0);
  }, [pause]);

  const toggleLoop = useCallback(() => {
    setIsLooping((prev) => !prev);
  }, []);

  // Ticking effect
  useEffect(() => {
    if (!isPlaying || snapshots.length <= 1) {
      clearTimer();
      return;
    }

    const currentDelay = Math.max(40, Math.round(baseSpeedMs / speed));

    const scheduleNext = () => {
      timerRef.current = setTimeout(() => {
        setCurrentStepIdx((prevIdx) => {
          if (prevIdx >= snapshots.length - 1) {
            if (isLooping) {
              return 0;
            }
            setIsPlaying(false);
            return prevIdx;
          }
          return prevIdx + 1;
        });
      }, currentDelay);
    };

    scheduleNext();

    return () => {
      clearTimer();
    };
  }, [isPlaying, currentStepIdx, snapshots.length, speed, baseSpeedMs, isLooping, clearTimer]);

  const currentSnapshot: StepSnapshot<T> | undefined = snapshots[currentStepIdx];
  const isFinished = snapshots.length > 0 && currentStepIdx >= snapshots.length - 1;
  const isAtStart = currentStepIdx === 0;
  const progressRatio = snapshots.length > 1 ? currentStepIdx / (snapshots.length - 1) : 0;

  return {
    snapshots,
    currentStepIdx,
    currentSnapshot,
    totalSteps: snapshots.length,
    isPlaying,
    speed,
    isLooping,
    isFinished,
    isAtStart,
    progressRatio,
    setSnapshots,
    play,
    pause,
    togglePlay,
    stepForward,
    stepBackward,
    jumpToStep,
    reset,
    setSpeed,
    toggleLoop,
  };
}
