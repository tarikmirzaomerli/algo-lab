import { useState, useEffect, useCallback, useRef } from 'react';
import { getAlgorithmById, SORTING_ALGORITHMS } from '../core/algorithms';
import { isGraphAlgorithm } from '../types/algorithm';
import type { GraphData, AnyAlgorithmStep } from '../types/graph';
import { enrichSimulationEvents } from '../core/explanations/explanationEngine';
import { enrichGraphEvents } from '../core/explanations/graphExplanationEngine';
import { generateArrayByPreset } from '../utils/arrayGenerator';
import type { DataPreset } from '../utils/arrayGenerator';
import { DEFAULT_GRAPH_PRESET } from '../core/constants/defaultGraph';

export function useAlgorithmRunner(initialAlgoId = 'bubble-sort', initialSize = 12) {
  const [selectedAlgoId, setSelectedAlgoId] = useState<string>(initialAlgoId);
  const [arraySize, setArraySizeState] = useState<number>(initialSize);
  const [preset, setPresetState] = useState<DataPreset>('random');
  const [initialArray, setInitialArray] = useState<number[]>(() =>
    generateArrayByPreset('random', initialSize)
  );
  const [initialGraph, setInitialGraph] = useState<GraphData>(DEFAULT_GRAPH_PRESET);
  const [currentTarget, setCurrentTarget] = useState<number | undefined>(undefined);

  const [steps, setSteps] = useState<AnyAlgorithmStep[]>([]);
  const [currentStepIdx, setCurrentStepIdx] = useState<number>(0);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [speed, setSpeed] = useState<number>(1);

  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const algorithm = getAlgorithmById(selectedAlgoId) || SORTING_ALGORITHMS['bubble-sort'];

  // Re-generate steps when algorithm or initialArray/initialGraph changes
  const rebuildSteps = useCallback(
    (arr: number[], algoId: string, customTarget?: number, currentGraph = initialGraph) => {
      const algo = getAlgorithmById(algoId) || SORTING_ALGORITHMS['bubble-sort'];

      if (isGraphAlgorithm(algo)) {
        // Graf Algoritması Boru Hattı
        setCurrentTarget(undefined);
        const rawGraphEvents = algo.generateSteps(currentGraph, 'A');
        const enrichedGraphSteps = enrichGraphEvents(rawGraphEvents);

        setSteps(enrichedGraphSteps);
        setCurrentStepIdx(0);
        setIsPlaying(false);
        return;
      }

      // Dizi Algoritması Boru Hattı (Sorting / Searching)
      let targetToUse: number | undefined = undefined;
      let workingArray = arr;

      if (
        algo.metadata.id === 'binary-search' ||
        algo.metadata.id === 'jump-search' ||
        algo.metadata.id === 'exponential-search' ||
        algo.metadata.id === 'interpolation-search'
      ) {
        workingArray = [...arr].sort((a, b) => a - b);
      }

      if (algo.metadata.category === 'searching') {
        if (customTarget !== undefined) {
          targetToUse = customTarget;
        } else if (workingArray.length > 0) {
          const randomIndex = Math.floor(Math.random() * workingArray.length);
          targetToUse = workingArray[randomIndex];
        }
      } else {
        targetToUse = undefined;
      }

      setCurrentTarget(targetToUse);

      const rawEvents = algo.generateSteps(workingArray, targetToUse);
      const enrichedSteps = enrichSimulationEvents(rawEvents);

      setSteps(enrichedSteps);
      setCurrentStepIdx(0);
      setIsPlaying(false);
    },
    [initialGraph]
  );

  useEffect(() => {
    rebuildSteps(initialArray, selectedAlgoId);
  }, [initialArray, selectedAlgoId, rebuildSteps]);

  useEffect(() => {
    if (isPlaying) {
      const baseDelay = 600;
      const delay = Math.max(50, Math.floor(baseDelay / speed));

      timerRef.current = setInterval(() => {
        setCurrentStepIdx((prevIdx) => {
          if (prevIdx >= steps.length - 1) {
            setIsPlaying(false);
            if (timerRef.current) clearInterval(timerRef.current);
            return prevIdx;
          }
          return prevIdx + 1;
        });
      }, delay);
    } else {
      if (timerRef.current) clearInterval(timerRef.current);
    }

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isPlaying, steps.length, speed]);

  const selectAlgorithm = (id: string) => {
    setSelectedAlgoId(id);
    setIsPlaying(false);
    rebuildSteps(initialArray, id);
  };

  const generateData = (newPreset: DataPreset, customArray?: number[]) => {
    setPresetState(newPreset);
    const newArr = generateArrayByPreset(newPreset, arraySize, customArray);
    setInitialArray(newArr);
    setIsPlaying(false);
  };

  const setArraySize = (newSize: number) => {
    setArraySizeState(newSize);
    const newArr = generateArrayByPreset(preset, newSize);
    setInitialArray(newArr);
    setIsPlaying(false);
  };

  const play = () => {
    if (currentStepIdx >= steps.length - 1) {
      setCurrentStepIdx(0);
    }
    setIsPlaying(true);
  };

  const pause = () => {
    setIsPlaying(false);
  };

  const togglePlay = () => {
    if (isPlaying) pause();
    else play();
  };

  const stepForward = () => {
    setIsPlaying(false);
    setCurrentStepIdx((prev) => Math.min(steps.length - 1, prev + 1));
  };

  const stepBackward = () => {
    setIsPlaying(false);
    setCurrentStepIdx((prev) => Math.max(0, prev - 1));
  };

  const restart = () => {
    setIsPlaying(false);
    setCurrentStepIdx(0);
  };

  const jumpToStep = (idx: number) => {
    setIsPlaying(false);
    setCurrentStepIdx(Math.max(0, Math.min(steps.length - 1, idx)));
  };

  const randomizeTarget = useCallback(() => {
    if (algorithm.metadata.category !== 'searching' || initialArray.length === 0) return;

    const workingArray =
      algorithm.metadata.id === 'binary-search' ||
      algorithm.metadata.id === 'jump-search' ||
      algorithm.metadata.id === 'exponential-search' ||
      algorithm.metadata.id === 'interpolation-search'
        ? [...initialArray].sort((a, b) => a - b)
        : initialArray;

    const candidates = workingArray.filter((val) => val !== currentTarget);
    const pool = candidates.length > 0 ? candidates : workingArray;
    const newTarget = pool[Math.floor(Math.random() * pool.length)];

    rebuildSteps(initialArray, selectedAlgoId, newTarget);
  }, [algorithm.metadata.category, algorithm.metadata.id, initialArray, currentTarget, selectedAlgoId, rebuildSteps]);

  const currentStep: AnyAlgorithmStep | undefined = steps[currentStepIdx];
  const isCompleted = currentStepIdx === steps.length - 1;

  return {
    selectedAlgoId,
    algorithm,
    arraySize,
    preset,
    initialArray,
    initialGraph,
    setInitialGraph,
    currentTarget,
    steps,
    currentStepIdx,
    currentStep,
    totalSteps: steps.length,
    isPlaying,
    speed,
    isCompleted,
    selectAlgorithm,
    setSpeed,
    setArraySize,
    generateData,
    randomizeTarget,
    play,
    pause,
    togglePlay,
    stepForward,
    stepBackward,
    restart,
    jumpToStep,
    rebuildSteps,
  };
}
