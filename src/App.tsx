import React, { useState, useEffect, useCallback } from 'react';
import { useVisualizerEngine } from './engine/useVisualizerEngine';
import type { StepSnapshot } from './engine/types';
import { getItemMetadata } from './algorithms/registry';
import { TRANSLATIONS, type Language } from './i18n/translations';

// Data Structures
import {
  type StackState,
  createInitialStack,
  generateStackPushSnapshots,
  generateStackPopSnapshots,
  generateStackPeekSnapshots,
} from './structures/stack/stackEngine';
import { StackVisualizer } from './structures/stack/StackVisualizer';

import {
  type QueueState,
  createInitialQueue,
  generateQueueEnqueueSnapshots,
  generateQueueDequeueSnapshots,
  generateQueuePeekSnapshots,
} from './structures/queue/queueEngine';
import { QueueVisualizer } from './structures/queue/QueueVisualizer';

import {
  type LinkedListState,
  createInitialLinkedList,
  generateInsertHeadSnapshots,
  generateInsertTailSnapshots,
  generateDeleteNodeSnapshots,
  generateSearchSnapshots,
} from './structures/linkedList/linkedListEngine';
import { LinkedListVisualizer } from './structures/linkedList/LinkedListVisualizer';

import {
  type BSTState,
  createInitialBST,
  generateBSTInsertSnapshots,
  generateBSTSearchSnapshots,
  generateBSTTraversalSnapshots,
} from './structures/bst/bstEngine';
import { BSTVisualizer } from './structures/bst/BSTVisualizer';

// Algorithms
import {
  type ArrayAlgorithmState,
  generateBubbleSortSnapshots,
} from './algorithms/sorting/bubbleSort';
import { generateSelectionSortSnapshots } from './algorithms/sorting/selectionSort';
import { generateInsertionSortSnapshots } from './algorithms/sorting/insertionSort';
import { generateQuickSortSnapshots } from './algorithms/sorting/quickSort';
import { generateMergeSortSnapshots } from './algorithms/sorting/mergeSort';
import { generateLinearSearchSnapshots } from './algorithms/searching/linearSearch';
import { generateBinarySearchSnapshots } from './algorithms/searching/binarySearch';
import { generateJumpSearchSnapshots } from './algorithms/searching/jumpSearch';
import { generateInterpolationSearchSnapshots } from './algorithms/searching/interpolationSearch';
import { generateExponentialSearchSnapshots } from './algorithms/searching/exponentialSearch';

// Layout & Controls
import { TopNavBar } from './components/layout/TopNavBar';
import { TransportDock } from './components/controls/TransportDock';
import { StructureActionToolbar } from './components/controls/StructureActionToolbar';
import { CodeDrawer } from './components/layout/CodeDrawer';
import { ArrayVisualizer } from './components/visualizers/ArrayVisualizer';
import { generateArrayByPreset } from './utils/arrayGenerator';

import './App.css';

export const App: React.FC = () => {
  const [selectedItemId, setSelectedItemId] = useState<string>('bubble-sort');
  const [isDrawerOpen, setIsDrawerOpen] = useState<boolean>(true);

  // i18n and Theme persistent states
  const [lang, setLang] = useState<Language>(() => {
    const saved = localStorage.getItem('algo_lang');
    return saved === 'en' || saved === 'tr' ? saved : 'tr';
  });

  const [theme, setTheme] = useState<'light' | 'dark'>(() => {
    const saved = localStorage.getItem('algo_theme');
    return saved === 'dark' || saved === 'light' ? saved : 'light';
  });

  // Sync theme to document root
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('algo_theme', theme);
  }, [theme]);

  // Sync lang to storage
  useEffect(() => {
    localStorage.setItem('algo_lang', lang);
  }, [lang]);

  const toggleTheme = () => {
    setTheme((prev) => (prev === 'light' ? 'dark' : 'light'));
  };

  const toggleLang = () => {
    setLang((prev) => (prev === 'tr' ? 'en' : 'tr'));
  };

  const t = TRANSLATIONS[lang];

  // Data structure persistent states
  const [stackState, setStackState] = useState<StackState>(() => createInitialStack());
  const [queueState, setQueueState] = useState<QueueState>(() => createInitialQueue());
  const [llState, setLLState] = useState<LinkedListState>(() => createInitialLinkedList());
  const [bstState, setBSTState] = useState<BSTState>(() => createInitialBST());

  // Array / Sorting persistent states
  const [arraySize, setArraySize] = useState<number>(10);
  const [initialArray, setInitialArray] = useState<number[]>(() =>
    generateArrayByPreset('random', 10)
  );
  const [currentTarget, setCurrentTarget] = useState<number>(initialArray[0] || 42);

  // Playback Engine Hook
  const {
    currentStepIdx,
    currentSnapshot,
    totalSteps,
    isPlaying,
    speed,
    isLooping,
    setSnapshots,
    play,
    togglePlay,
    stepForward,
    stepBackward,
    jumpToStep,
    reset,
    setSpeed,
    toggleLoop,
  } = useVisualizerEngine();

  // Rebuild snapshots whenever active item or underlying initial data changes
  const rebuildItemSnapshots = useCallback(
    (itemId: string, customTarget = currentTarget, customArr = initialArray) => {
      let generatedSnapshots: StepSnapshot[] = [];

      switch (itemId) {
        case 'stack':
          generatedSnapshots = generateStackPeekSnapshots(stackState);
          break;
        case 'queue':
          generatedSnapshots = generateQueuePeekSnapshots(queueState);
          break;
        case 'linked-list':
          generatedSnapshots = generateSearchSnapshots(llState, llState.nodes[0]?.value || 24);
          break;
        case 'bst':
          generatedSnapshots = generateBSTTraversalSnapshots(bstState, 'inorder');
          break;
        case 'bubble-sort':
          generatedSnapshots = generateBubbleSortSnapshots(customArr);
          break;
        case 'selection-sort':
          generatedSnapshots = generateSelectionSortSnapshots(customArr);
          break;
        case 'insertion-sort':
          generatedSnapshots = generateInsertionSortSnapshots(customArr);
          break;
        case 'quick-sort':
          generatedSnapshots = generateQuickSortSnapshots(customArr);
          break;
        case 'merge-sort':
          generatedSnapshots = generateMergeSortSnapshots(customArr);
          break;
        case 'linear-search':
          generatedSnapshots = generateLinearSearchSnapshots(customArr, customTarget);
          break;
        case 'binary-search': {
          const sorted = [...customArr].sort((a, b) => a - b);
          generatedSnapshots = generateBinarySearchSnapshots(sorted, customTarget);
          break;
        }
        case 'jump-search': {
          const sorted = [...customArr].sort((a, b) => a - b);
          generatedSnapshots = generateJumpSearchSnapshots(sorted, customTarget);
          break;
        }
        case 'interpolation-search': {
          const sorted = [...customArr].sort((a, b) => a - b);
          generatedSnapshots = generateInterpolationSearchSnapshots(sorted, customTarget);
          break;
        }
        case 'exponential-search': {
          const sorted = [...customArr].sort((a, b) => a - b);
          generatedSnapshots = generateExponentialSearchSnapshots(sorted, customTarget);
          break;
        }
        default:
          generatedSnapshots = generateBubbleSortSnapshots(customArr);
      }

      setSnapshots(generatedSnapshots);
    },
    [stackState, queueState, llState, bstState, initialArray, currentTarget, setSnapshots]
  );

  useEffect(() => {
    rebuildItemSnapshots(selectedItemId);
  }, [selectedItemId, rebuildItemSnapshots]);

  // Global Keyboard Shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (
        e.target instanceof HTMLInputElement ||
        e.target instanceof HTMLTextAreaElement ||
        e.target instanceof HTMLSelectElement
      ) {
        return;
      }

      if (e.code === 'Space') {
        e.preventDefault();
        togglePlay();
      } else if (e.code === 'ArrowLeft') {
        e.preventDefault();
        stepBackward();
      } else if (e.code === 'ArrowRight') {
        e.preventDefault();
        stepForward();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [togglePlay, stepBackward, stepForward]);

  // --- Handlers for Structure Operations ---

  // Stack
  const handleStackPush = (val: number) => {
    const snaps = generateStackPushSnapshots(stackState, val);
    const lastSnap = snaps[snaps.length - 1];
    if (lastSnap?.structureState) {
      setStackState(lastSnap.structureState as StackState);
    }
    setSnapshots(snaps);
    play();
  };

  const handleStackPop = () => {
    const snaps = generateStackPopSnapshots(stackState);
    const lastSnap = snaps[snaps.length - 1];
    if (lastSnap?.structureState) {
      setStackState(lastSnap.structureState as StackState);
    }
    setSnapshots(snaps);
    play();
  };

  const handleStackPeek = () => {
    const snaps = generateStackPeekSnapshots(stackState);
    setSnapshots(snaps);
    play();
  };

  const handleStackReset = () => {
    const fresh = createInitialStack();
    setStackState(fresh);
    setSnapshots(generateStackPeekSnapshots(fresh));
  };

  // Queue
  const handleQueueEnqueue = (val: number) => {
    const snaps = generateQueueEnqueueSnapshots(queueState, val);
    const lastSnap = snaps[snaps.length - 1];
    if (lastSnap?.structureState) {
      setQueueState(lastSnap.structureState as QueueState);
    }
    setSnapshots(snaps);
    play();
  };

  const handleQueueDequeue = () => {
    const snaps = generateQueueDequeueSnapshots(queueState);
    const lastSnap = snaps[snaps.length - 1];
    if (lastSnap?.structureState) {
      setQueueState(lastSnap.structureState as QueueState);
    }
    setSnapshots(snaps);
    play();
  };

  const handleQueuePeek = () => {
    const snaps = generateQueuePeekSnapshots(queueState);
    setSnapshots(snaps);
    play();
  };

  const handleQueueReset = () => {
    const fresh = createInitialQueue();
    setQueueState(fresh);
    setSnapshots(generateQueuePeekSnapshots(fresh));
  };

  // Linked List
  const handleLLInsertHead = (val: number) => {
    const snaps = generateInsertHeadSnapshots(llState, val);
    const lastSnap = snaps[snaps.length - 1];
    if (lastSnap?.structureState) {
      setLLState(lastSnap.structureState as LinkedListState);
    }
    setSnapshots(snaps);
    play();
  };

  const handleLLInsertTail = (val: number) => {
    const snaps = generateInsertTailSnapshots(llState, val);
    const lastSnap = snaps[snaps.length - 1];
    if (lastSnap?.structureState) {
      setLLState(lastSnap.structureState as LinkedListState);
    }
    setSnapshots(snaps);
    play();
  };

  const handleLLDelete = (val: number) => {
    const snaps = generateDeleteNodeSnapshots(llState, val);
    const lastSnap = snaps[snaps.length - 1];
    if (lastSnap?.structureState) {
      setLLState(lastSnap.structureState as LinkedListState);
    }
    setSnapshots(snaps);
    play();
  };

  const handleLLSearch = (val: number) => {
    const snaps = generateSearchSnapshots(llState, val);
    setSnapshots(snaps);
    play();
  };

  const handleLLReset = () => {
    const fresh = createInitialLinkedList();
    setLLState(fresh);
    setSnapshots(generateSearchSnapshots(fresh, 24));
  };

  // BST
  const handleBSTInsert = (val: number) => {
    const snaps = generateBSTInsertSnapshots(bstState, val);
    const lastSnap = snaps[snaps.length - 1];
    if (lastSnap?.structureState) {
      setBSTState(lastSnap.structureState as BSTState);
    }
    setSnapshots(snaps);
    play();
  };

  const handleBSTSearch = (val: number) => {
    const snaps = generateBSTSearchSnapshots(bstState, val);
    setSnapshots(snaps);
    play();
  };

  const handleBSTTraverse = (order: 'inorder' | 'preorder' | 'postorder' | 'levelorder') => {
    const snaps = generateBSTTraversalSnapshots(bstState, order);
    setSnapshots(snaps);
    play();
  };

  const handleBSTReset = () => {
    const fresh = createInitialBST();
    setBSTState(fresh);
    setSnapshots(generateBSTTraversalSnapshots(fresh, 'inorder'));
  };

  // Array / Sorting
  const handleSetArraySize = (newSize: number) => {
    setArraySize(newSize);
    const newArr = generateArrayByPreset('random', newSize);
    setInitialArray(newArr);
    if (newArr.length > 0) setCurrentTarget(newArr[Math.floor(Math.random() * newArr.length)]);
  };

  const handleRandomizeArray = () => {
    const newArr = generateArrayByPreset('random', arraySize);
    setInitialArray(newArr);
    if (newArr.length > 0) setCurrentTarget(newArr[Math.floor(Math.random() * newArr.length)]);
  };

  const handlePresetArray = (preset: 'random' | 'nearly-sorted' | 'reversed') => {
    const p = preset === 'reversed' ? 'reverse' : preset;
    const newArr = generateArrayByPreset(p, arraySize);
    setInitialArray(newArr);
    if (newArr.length > 0) setCurrentTarget(newArr[Math.floor(Math.random() * newArr.length)]);
  };

  const handleRandomizeTarget = () => {
    if (initialArray.length === 0) return;
    const newTarget = initialArray[Math.floor(Math.random() * initialArray.length)];
    setCurrentTarget(newTarget);
    rebuildItemSnapshots(selectedItemId, newTarget, initialArray);
  };

  const currentMetadata = getItemMetadata(selectedItemId);
  const isSortedSearch = [
    'binary-search',
    'jump-search',
    'interpolation-search',
    'exponential-search',
  ].includes(selectedItemId);

  return (
    <div className="algo-lab-app">
      {/* 1. Minimalist Top Navigation Bar */}
      <TopNavBar
        selectedItemId={selectedItemId}
        onSelectItem={(id) => {
          setSelectedItemId(id);
        }}
        isDrawerOpen={isDrawerOpen}
        onToggleDrawer={() => setIsDrawerOpen((prev) => !prev)}
        lang={lang}
        onToggleLang={toggleLang}
        theme={theme}
        onToggleTheme={toggleTheme}
        t={t}
      />

      {/* 2. Main Center Workspace */}
      <div className="algo-lab-body">
        <main className="algo-lab-stage">
          {/* Action Toolbar above canvas */}
          <StructureActionToolbar
            selectedItemId={selectedItemId}
            t={t}
            onStackPush={handleStackPush}
            onStackPop={handleStackPop}
            onStackPeek={handleStackPeek}
            onStackReset={handleStackReset}
            onQueueEnqueue={handleQueueEnqueue}
            onQueueDequeue={handleQueueDequeue}
            onQueuePeek={handleQueuePeek}
            onQueueReset={handleQueueReset}
            onLLInsertHead={handleLLInsertHead}
            onLLInsertTail={handleLLInsertTail}
            onLLDelete={handleLLDelete}
            onLLSearch={handleLLSearch}
            onLLReset={handleLLReset}
            onBSTInsert={handleBSTInsert}
            onBSTSearch={handleBSTSearch}
            onBSTTraverse={handleBSTTraverse}
            onBSTReset={handleBSTReset}
            arraySize={arraySize}
            onSetArraySize={handleSetArraySize}
            onRandomizeArray={handleRandomizeArray}
            onPresetArray={handlePresetArray}
            currentTarget={currentTarget}
            onRandomizeTarget={handleRandomizeTarget}
          />

          {/* Interactive Viewport Canvas */}
          <div className="visualizer-viewport">
            {selectedItemId === 'stack' && (
              <StackVisualizer
                snapshot={currentSnapshot as StepSnapshot<StackState>}
                currentState={stackState}
                t={t}
              />
            )}

            {selectedItemId === 'queue' && (
              <QueueVisualizer
                snapshot={currentSnapshot as StepSnapshot<QueueState>}
                currentState={queueState}
                t={t}
              />
            )}

            {selectedItemId === 'linked-list' && (
              <LinkedListVisualizer
                snapshot={currentSnapshot as StepSnapshot<LinkedListState>}
                currentState={llState}
                t={t}
              />
            )}

            {selectedItemId === 'bst' && (
              <BSTVisualizer
                snapshot={currentSnapshot as StepSnapshot<BSTState>}
                currentState={bstState}
                t={t}
              />
            )}

            {/* Sorting & Searching Bar Visualizer */}
            {!['stack', 'queue', 'linked-list', 'bst'].includes(selectedItemId) && (
              <ArrayVisualizer
                snapshot={currentSnapshot as StepSnapshot<ArrayAlgorithmState>}
                initialArray={
                  isSortedSearch
                    ? [...initialArray].sort((a, b) => a - b)
                    : initialArray
                }
                t={t}
              />
            )}
          </div>
        </main>

        {/* 3. Collapsible Right Drawer with Pseudocode & Live Metrics */}
        <CodeDrawer
          metadata={currentMetadata}
          currentSnapshot={currentSnapshot}
          isOpen={isDrawerOpen}
          onClose={() => setIsDrawerOpen(false)}
          lang={lang}
          t={t}
        />
      </div>

      {/* 4. Persistent Transport Dock */}
      <TransportDock
        isPlaying={isPlaying}
        currentStepIdx={currentStepIdx}
        totalSteps={totalSteps}
        speed={speed}
        isLooping={isLooping}
        t={t}
        onTogglePlay={togglePlay}
        onStepForward={stepForward}
        onStepBackward={stepBackward}
        onReset={reset}
        onJumpToStep={jumpToStep}
        onSetSpeed={setSpeed}
        onToggleLoop={toggleLoop}
      />
    </div>
  );
};

export default App;
