import { describe, it, expect } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useVisualizerEngine } from '../../engine/useVisualizerEngine';
import type { StepSnapshot } from '../../engine/types';

describe('useVisualizerEngine Playback Controller', () => {
  const dummySnapshots: StepSnapshot<number>[] = [
    {
      structureState: 10,
      activeIndicesOrNodes: [0],
      operationType: 'compare',
      codeLine: 1,
      statusNote: 'Step 1',
      metrics: { comparisons: 1, operations: 1, timeComplexity: 'O(1)', spaceComplexity: 'O(1)' },
    },
    {
      structureState: 20,
      activeIndicesOrNodes: [1],
      operationType: 'swap',
      codeLine: 2,
      statusNote: 'Step 2',
      metrics: { comparisons: 2, operations: 2, timeComplexity: 'O(1)', spaceComplexity: 'O(1)' },
    },
    {
      structureState: 30,
      activeIndicesOrNodes: [2],
      operationType: 'settled',
      codeLine: 3,
      statusNote: 'Step 3',
      metrics: { comparisons: 3, operations: 3, timeComplexity: 'O(1)', spaceComplexity: 'O(1)' },
    },
  ];

  it('should initialize with starting step 0 and paused state', () => {
    const { result } = renderHook(() => useVisualizerEngine(dummySnapshots));
    expect(result.current.currentStepIdx).toBe(0);
    expect(result.current.totalSteps).toBe(3);
    expect(result.current.isPlaying).toBe(false);
    expect(result.current.currentSnapshot?.structureState).toBe(10);
  });

  it('should step forward and backward correctly within bounds', () => {
    const { result } = renderHook(() => useVisualizerEngine(dummySnapshots));

    act(() => {
      result.current.stepForward();
    });
    expect(result.current.currentStepIdx).toBe(1);
    expect(result.current.currentSnapshot?.structureState).toBe(20);

    act(() => {
      result.current.stepForward();
    });
    expect(result.current.currentStepIdx).toBe(2);

    // Cannot step beyond last snapshot
    act(() => {
      result.current.stepForward();
    });
    expect(result.current.currentStepIdx).toBe(2);

    // Step backward
    act(() => {
      result.current.stepBackward();
    });
    expect(result.current.currentStepIdx).toBe(1);

    act(() => {
      result.current.stepBackward();
    });
    expect(result.current.currentStepIdx).toBe(0);

    // Cannot step before 0
    act(() => {
      result.current.stepBackward();
    });
    expect(result.current.currentStepIdx).toBe(0);
  });

  it('should jumpToStep instantly and reset correctly', () => {
    const { result } = renderHook(() => useVisualizerEngine(dummySnapshots));

    act(() => {
      result.current.jumpToStep(2);
    });
    expect(result.current.currentStepIdx).toBe(2);

    act(() => {
      result.current.reset();
    });
    expect(result.current.currentStepIdx).toBe(0);
  });

  it('should update speed correctly', () => {
    const { result } = renderHook(() => useVisualizerEngine(dummySnapshots));

    act(() => {
      result.current.setSpeed(2);
    });
    expect(result.current.speed).toBe(2);
  });
});
