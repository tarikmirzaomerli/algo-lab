import React, { useState } from 'react';
import {
  Plus,
  Minus,
  Eye,
  Trash2,
  Shuffle,
  Search,
  Sparkles,
  ListOrdered,
} from 'lucide-react';
import './StructureActionToolbar.css';

interface StructureActionToolbarProps {
  selectedItemId: string;
  // Stack actions
  onStackPush?: (val: number) => void;
  onStackPop?: () => void;
  onStackPeek?: () => void;
  onStackReset?: () => void;
  // Queue actions
  onQueueEnqueue?: (val: number) => void;
  onQueueDequeue?: () => void;
  onQueuePeek?: () => void;
  onQueueReset?: () => void;
  // Linked List actions
  onLLInsertHead?: (val: number) => void;
  onLLInsertTail?: (val: number) => void;
  onLLDelete?: (val: number) => void;
  onLLSearch?: (val: number) => void;
  onLLReset?: () => void;
  // BST actions
  onBSTInsert?: (val: number) => void;
  onBSTSearch?: (val: number) => void;
  onBSTTraverse?: (order: 'inorder' | 'preorder' | 'postorder' | 'levelorder') => void;
  onBSTReset?: () => void;
  // Sorting / Searching actions
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
  arraySize = 12,
  onSetArraySize,
  onRandomizeArray,
  onPresetArray,
  currentTarget,
  onRandomizeTarget,
  onSetCustomTarget: _onSetCustomTarget,
}) => {
  const [inputValue, setInputValue] = useState<string>('50');

  const getNumericValue = () => {
    const parsed = parseInt(inputValue, 10);
    return isNaN(parsed) ? Math.floor(Math.random() * 90) + 10 : parsed;
  };

  const handleRandomizeInput = () => {
    setInputValue(String(Math.floor(Math.random() * 90) + 10));
  };

  return (
    <div className="action-toolbar-container">
      {/* 1. STACK TOOLBAR */}
      {selectedItemId === 'stack' && (
        <div className="toolbar-row">
          <div className="input-with-stepper">
            <input
              type="number"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              placeholder="Değer"
              className="toolbar-num-input"
              max={99}
              min={1}
            />
            <button
              onClick={handleRandomizeInput}
              className="action-icon-btn"
              title="Rastgele Değer"
            >
              <Sparkles size={14} />
            </button>
          </div>

          <button
            onClick={() => onStackPush?.(getNumericValue())}
            className="toolbar-btn primary"
          >
            <Plus size={15} />
            <span>Push ({getNumericValue()})</span>
          </button>

          <button onClick={onStackPop} className="toolbar-btn warn">
            <Minus size={15} />
            <span>Pop</span>
          </button>

          <button onClick={onStackPeek} className="toolbar-btn secondary">
            <Eye size={15} />
            <span>Peek</span>
          </button>

          <button onClick={onStackReset} className="toolbar-btn secondary">
            <Trash2 size={15} />
            <span>Sıfırla</span>
          </button>
        </div>
      )}

      {/* 2. QUEUE TOOLBAR */}
      {selectedItemId === 'queue' && (
        <div className="toolbar-row">
          <div className="input-with-stepper">
            <input
              type="number"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              placeholder="Değer"
              className="toolbar-num-input"
              max={99}
              min={1}
            />
            <button
              onClick={handleRandomizeInput}
              className="action-icon-btn"
              title="Rastgele Değer"
            >
              <Sparkles size={14} />
            </button>
          </div>

          <button
            onClick={() => onQueueEnqueue?.(getNumericValue())}
            className="toolbar-btn primary"
          >
            <Plus size={15} />
            <span>Enqueue ({getNumericValue()})</span>
          </button>

          <button onClick={onQueueDequeue} className="toolbar-btn warn">
            <Minus size={15} />
            <span>Dequeue</span>
          </button>

          <button onClick={onQueuePeek} className="toolbar-btn secondary">
            <Eye size={15} />
            <span>Peek Front</span>
          </button>

          <button onClick={onQueueReset} className="toolbar-btn secondary">
            <Trash2 size={15} />
            <span>Sıfırla</span>
          </button>
        </div>
      )}

      {/* 3. LINKED LIST TOOLBAR */}
      {selectedItemId === 'linked-list' && (
        <div className="toolbar-row">
          <div className="input-with-stepper">
            <input
              type="number"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              placeholder="Değer"
              className="toolbar-num-input"
              max={99}
              min={1}
            />
            <button
              onClick={handleRandomizeInput}
              className="action-icon-btn"
              title="Rastgele Değer"
            >
              <Sparkles size={14} />
            </button>
          </div>

          <button
            onClick={() => onLLInsertHead?.(getNumericValue())}
            className="toolbar-btn primary"
          >
            <span>Başa Ekle</span>
          </button>

          <button
            onClick={() => onLLInsertTail?.(getNumericValue())}
            className="toolbar-btn primary"
          >
            <span>Sona Ekle</span>
          </button>

          <button
            onClick={() => onLLDelete?.(getNumericValue())}
            className="toolbar-btn warn"
          >
            <span>Sil ({getNumericValue()})</span>
          </button>

          <button
            onClick={() => onLLSearch?.(getNumericValue())}
            className="toolbar-btn secondary"
          >
            <Search size={15} />
            <span>Ara</span>
          </button>

          <button onClick={onLLReset} className="toolbar-btn secondary">
            <Trash2 size={15} />
            <span>Örnek Liste</span>
          </button>
        </div>
      )}

      {/* 4. BST TOOLBAR */}
      {selectedItemId === 'bst' && (
        <div className="toolbar-row">
          <div className="input-with-stepper">
            <input
              type="number"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              placeholder="Değer"
              className="toolbar-num-input"
              max={99}
              min={1}
            />
            <button
              onClick={handleRandomizeInput}
              className="action-icon-btn"
              title="Rastgele Değer"
            >
              <Sparkles size={14} />
            </button>
          </div>

          <button
            onClick={() => onBSTInsert?.(getNumericValue())}
            className="toolbar-btn primary"
          >
            <Plus size={15} />
            <span>Ekle ({getNumericValue()})</span>
          </button>

          <button
            onClick={() => onBSTSearch?.(getNumericValue())}
            className="toolbar-btn secondary"
          >
            <Search size={15} />
            <span>Ara</span>
          </button>

          {/* Traversal Selector */}
          <div className="traversal-select-group">
            <button
              onClick={() => onBSTTraverse?.('inorder')}
              className="toolbar-btn traversal-btn"
              title="Küçükten büyüğe sıralı gezinme"
            >
              <ListOrdered size={14} />
              <span>In-Order</span>
            </button>

            <button
              onClick={() => onBSTTraverse?.('preorder')}
              className="toolbar-btn traversal-btn"
            >
              <span>Pre-Order</span>
            </button>

            <button
              onClick={() => onBSTTraverse?.('postorder')}
              className="toolbar-btn traversal-btn"
            >
              <span>Post-Order</span>
            </button>

            <button
              onClick={() => onBSTTraverse?.('levelorder')}
              className="toolbar-btn traversal-btn"
            >
              <span>Level-Order (BFS)</span>
            </button>
          </div>

          <button onClick={onBSTReset} className="toolbar-btn secondary">
            <Trash2 size={15} />
            <span>Örnek Ağaç</span>
          </button>
        </div>
      )}

      {/* 5. SORTING & SEARCHING TOOLBAR */}
      {(selectedItemId.includes('sort') || selectedItemId.includes('search')) && (
        <div className="toolbar-row">
          {/* Size Slider */}
          <div className="slider-pill-group">
            <span className="slider-label">Boyut: {arraySize}</span>
            <input
              type="range"
              min={6}
              max={24}
              value={arraySize}
              onChange={(e) => onSetArraySize?.(Number(e.target.value))}
              className="size-slider"
            />
          </div>

          {/* Preset Buttons */}
          <button
            onClick={onRandomizeArray}
            className="toolbar-btn secondary"
            title="Rastgele Dizi Üret"
          >
            <Shuffle size={14} />
            <span>Karıştır</span>
          </button>

          <button
            onClick={() => onPresetArray?.('nearly-sorted')}
            className="toolbar-btn secondary"
          >
            <span>Neredeyse Sıralı</span>
          </button>

          <button
            onClick={() => onPresetArray?.('reversed')}
            className="toolbar-btn secondary"
          >
            <span>Ters Sıralı</span>
          </button>

          {/* For Searching: Target Value */}
          {selectedItemId.includes('search') && currentTarget !== undefined && (
            <div className="search-target-pill">
              <span className="target-label">HEDEF:</span>
              <span className="target-val">{currentTarget}</span>
              <button
                onClick={onRandomizeTarget}
                className="action-icon-btn"
                title="Yeni Hedef Seç"
              >
                <Sparkles size={13} />
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
