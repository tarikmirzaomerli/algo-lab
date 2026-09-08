import React, { useState } from 'react';
import {
  Plus,
  Minus,
  Eye,
  RotateCcw,
  Shuffle,
  Search,
  Sparkles,
  ListOrdered,
} from 'lucide-react';
import type { Translations } from '../../i18n/translations';
import './StructureActionToolbar.css';

interface StructureActionToolbarProps {
  selectedItemId: string;
  t: Translations;
  // Stack
  onStackPush?: (val: number) => void;
  onStackPop?: () => void;
  onStackPeek?: () => void;
  onStackReset?: () => void;
  // Queue
  onQueueEnqueue?: (val: number) => void;
  onQueueDequeue?: () => void;
  onQueuePeek?: () => void;
  onQueueReset?: () => void;
  // Linked List
  onLLInsertHead?: (val: number) => void;
  onLLInsertTail?: (val: number) => void;
  onLLDelete?: (val: number) => void;
  onLLSearch?: (val: number) => void;
  onLLReset?: () => void;
  // BST
  onBSTInsert?: (val: number) => void;
  onBSTSearch?: (val: number) => void;
  onBSTTraverse?: (order: 'inorder' | 'preorder' | 'postorder' | 'levelorder') => void;
  onBSTReset?: () => void;
  // Sorting / Searching
  arraySize?: number;
  onSetArraySize?: (size: number) => void;
  onRandomizeArray?: () => void;
  onPresetArray?: (preset: 'random' | 'nearly-sorted' | 'reversed') => void;
  currentTarget?: number;
  onRandomizeTarget?: () => void;
  onSetCustomTarget?: (target: number) => void;
}

export const StructureActionToolbar: React.FC<StructureActionToolbarProps> = ({
  selectedItemId,
  t,
  onStackPush,
  onStackPop,
  onStackPeek,
  onStackReset,
  onQueueEnqueue,
  onQueueDequeue,
  onQueuePeek,
  onQueueReset,
  onLLInsertHead,
  onLLInsertTail,
  onLLDelete,
  onLLSearch,
  onLLReset,
  onBSTInsert,
  onBSTSearch,
  onBSTTraverse,
  onBSTReset,
  arraySize = 10,
  onSetArraySize,
  onRandomizeArray,
  onPresetArray,
  currentTarget,
  onRandomizeTarget,
  onSetCustomTarget: _onSetCustomTarget,
}) => {
  const [inputValue, setInputValue] = useState<string>('45');

  const getNumericValue = () => {
    const parsed = parseInt(inputValue, 10);
    return isNaN(parsed) ? Math.floor(Math.random() * 90) + 10 : parsed;
  };

  const handleRandomizeInput = () => {
    setInputValue(String(Math.floor(Math.random() * 90) + 10));
  };

  return (
    <div className="action-toolbar-container">
      {/* 1. STACK CONTROLS */}
      {selectedItemId === 'stack' && (
        <div className="toolbar-row">
          <div className="input-stepper-box">
            <input
              type="number"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              className="stepper-input"
              max={99}
              min={1}
            />
            <button onClick={handleRandomizeInput} className="stepper-btn" title={t.randomNum}>
              <Sparkles size={13} />
            </button>
          </div>

          <button onClick={() => onStackPush?.(getNumericValue())} className="pill-btn primary">
            <Plus size={14} />
            <span>{t.stack.push} ({getNumericValue()})</span>
          </button>

          <button onClick={onStackPop} className="pill-btn warn">
            <Minus size={14} />
            <span>{t.stack.pop}</span>
          </button>

          <button onClick={onStackPeek} className="pill-btn secondary">
            <Eye size={14} />
            <span>{t.stack.peek}</span>
          </button>

          <button onClick={onStackReset} className="pill-btn subtle" title={t.stack.clear}>
            <RotateCcw size={14} />
          </button>
        </div>
      )}

      {/* 2. QUEUE CONTROLS */}
      {selectedItemId === 'queue' && (
        <div className="toolbar-row">
          <div className="input-stepper-box">
            <input
              type="number"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              className="stepper-input"
              max={99}
              min={1}
            />
            <button onClick={handleRandomizeInput} className="stepper-btn" title={t.randomNum}>
              <Sparkles size={13} />
            </button>
          </div>

          <button onClick={() => onQueueEnqueue?.(getNumericValue())} className="pill-btn primary">
            <Plus size={14} />
            <span>{t.queue.enqueue} ({getNumericValue()})</span>
          </button>

          <button onClick={onQueueDequeue} className="pill-btn warn">
            <Minus size={14} />
            <span>{t.queue.dequeue}</span>
          </button>

          <button onClick={onQueuePeek} className="pill-btn secondary">
            <Eye size={14} />
            <span>{t.queue.peekFront}</span>
          </button>

          <button onClick={onQueueReset} className="pill-btn subtle" title={t.queue.clear}>
            <RotateCcw size={14} />
          </button>
        </div>
      )}

      {/* 3. LINKED LIST CONTROLS */}
      {selectedItemId === 'linked-list' && (
        <div className="toolbar-row">
          <div className="input-stepper-box">
            <input
              type="number"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              className="stepper-input"
              max={99}
              min={1}
            />
            <button onClick={handleRandomizeInput} className="stepper-btn" title={t.randomNum}>
              <Sparkles size={13} />
            </button>
          </div>

          <button onClick={() => onLLInsertHead?.(getNumericValue())} className="pill-btn primary">
            <span>{t.linkedList.insertHead}</span>
          </button>

          <button onClick={() => onLLInsertTail?.(getNumericValue())} className="pill-btn primary">
            <span>{t.linkedList.insertTail}</span>
          </button>

          <button onClick={() => onLLDelete?.(getNumericValue())} className="pill-btn warn">
            <span>{t.linkedList.delete} ({getNumericValue()})</span>
          </button>

          <button onClick={() => onLLSearch?.(getNumericValue())} className="pill-btn secondary">
            <Search size={14} />
            <span>{t.linkedList.search}</span>
          </button>

          <button onClick={onLLReset} className="pill-btn subtle" title={t.reset}>
            <RotateCcw size={14} />
          </button>
        </div>
      )}

      {/* 4. BST CONTROLS */}
      {selectedItemId === 'bst' && (
        <div className="toolbar-row">
          <div className="input-stepper-box">
            <input
              type="number"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              className="stepper-input"
              max={99}
              min={1}
            />
            <button onClick={handleRandomizeInput} className="stepper-btn" title={t.randomNum}>
              <Sparkles size={13} />
            </button>
          </div>

          <button onClick={() => onBSTInsert?.(getNumericValue())} className="pill-btn primary">
            <Plus size={14} />
            <span>{t.bst.insert} ({getNumericValue()})</span>
          </button>

          <button onClick={() => onBSTSearch?.(getNumericValue())} className="pill-btn secondary">
            <Search size={14} />
            <span>{t.bst.search}</span>
          </button>

          <div className="traversal-pill-group">
            <button
              onClick={() => onBSTTraverse?.('inorder')}
              className="traversal-tab"
              title="In-Order Traversal"
            >
              <ListOrdered size={13} />
              <span>{t.bst.inorder}</span>
            </button>

            <button onClick={() => onBSTTraverse?.('preorder')} className="traversal-tab">
              <span>{t.bst.preorder}</span>
            </button>

            <button onClick={() => onBSTTraverse?.('postorder')} className="traversal-tab">
              <span>{t.bst.postorder}</span>
            </button>

            <button onClick={() => onBSTTraverse?.('levelorder')} className="traversal-tab">
              <span>{t.bst.levelorder}</span>
            </button>
          </div>

          <button onClick={onBSTReset} className="pill-btn subtle" title={t.reset}>
            <RotateCcw size={14} />
          </button>
        </div>
      )}

      {/* 5. SORTING CONTROLS */}
      {selectedItemId.includes('sort') && (
        <div className="toolbar-row">
          <button onClick={onRandomizeArray} className="pill-btn primary">
            <Shuffle size={14} />
            <span>{t.randomize}</span>
          </button>

          <button onClick={() => onPresetArray?.('nearly-sorted')} className="pill-btn secondary">
            <span>{t.nearlySorted}</span>
          </button>

          <button onClick={() => onPresetArray?.('reversed')} className="pill-btn secondary">
            <span>{t.reversed}</span>
          </button>

          <div className="size-slider-pill">
            <span className="slider-text">{t.elements}: {arraySize}</span>
            <input
              type="range"
              min={6}
              max={20}
              value={arraySize}
              onChange={(e) => onSetArraySize?.(Number(e.target.value))}
              className="pill-range-slider"
            />
          </div>
        </div>
      )}

      {/* 6. SEARCHING CONTROLS (All 5 Algorithms) */}
      {selectedItemId.includes('search') && (
        <div className="toolbar-row">
          {currentTarget !== undefined && (
            <div className="target-badge-pill">
              <span className="target-title">{t.target}</span>
              <span className="target-number">{currentTarget}</span>
              <button
                onClick={onRandomizeTarget}
                className="target-dice-btn"
                title={t.newTarget}
              >
                <Sparkles size={13} />
              </button>
            </div>
          )}

          <button onClick={onRandomizeArray} className="pill-btn secondary">
            <Shuffle size={14} />
            <span>{t.newArray}</span>
          </button>

          <div className="size-slider-pill">
            <span className="slider-text">{t.size}: {arraySize}</span>
            <input
              type="range"
              min={6}
              max={20}
              value={arraySize}
              onChange={(e) => onSetArraySize?.(Number(e.target.value))}
              className="pill-range-slider"
            />
          </div>
        </div>
      )}
    </div>
  );
};
