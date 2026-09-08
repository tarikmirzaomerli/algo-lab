import React from 'react';
import type { StepSnapshot } from '../../engine/types';
import type { StackState } from './stackEngine';
import type { Translations } from '../../i18n/translations';
import './StackVisualizer.css';

interface StackVisualizerProps {
  snapshot?: StepSnapshot<StackState>;
  currentState: StackState;
  t?: Translations;
}

export const StackVisualizer: React.FC<StackVisualizerProps> = ({ snapshot, currentState, t }) => {
  const items = Array.isArray(snapshot?.structureState?.items)
    ? snapshot.structureState.items
    : (currentState?.items || []);
  const capacity = snapshot?.structureState?.capacity || currentState?.capacity || 7;
  const activeIds = snapshot?.activeIndicesOrNodes || [];
  const opType = snapshot?.operationType || 'idle';
  const topPointer =
    snapshot?.pointers?.top !== undefined
      ? Number(snapshot.pointers.top)
      : items.length > 0
      ? items.length - 1
      : -1;

  const slots = Array.from({ length: capacity }, (_, i) => capacity - 1 - i); // Render top slot first

  return (
    <div className="stack-visualizer-container">
      {/* Top Title & Quick Indicator */}
      <div className="stack-status-ribbon">
        <div className="stack-badge-pill">
          <span className="badge-dot" />
          <span>{t ? `${t.stack.capacity}: ${items.length} / ${capacity}` : `Kapasite: ${items.length} / ${capacity}`}</span>
        </div>
        <div className="stack-badge-pill secondary">
          <span>{t ? t.stack.lifo : 'LIFO (Last In First Out)'}</span>
        </div>
      </div>

      {/* Main Canister Viewport */}
      <div className="canister-wrapper">
        <div className="canister-tube">
          {/* Canister slots from top (capacity-1) down to 0 */}
          {slots.map((slotIdx) => {
            const item = items[slotIdx];
            const isTop = slotIdx === topPointer && topPointer >= 0;
            const isActive = item && activeIds.includes(item.id);
            const isPushing = isActive && opType === 'push';
            const isPopping = isActive && opType === 'pop';
            const isPeeking = isActive && opType === 'peek';

            let itemClass = 'canister-item';
            if (isPushing) itemClass += ' item-pushing';
            else if (isPopping) itemClass += ' item-popping';
            else if (isPeeking) itemClass += ' item-peeking';
            else if (isTop) itemClass += ' item-top';

            return (
              <div key={slotIdx} className="canister-slot">
                <div className="slot-index-label">[{slotIdx}]</div>

                <div className="slot-cell">
                  {item ? (
                    <div className={itemClass} key={item.id}>
                      <span className="item-val">{item.value}</span>
                      {isTop && <span className="top-indicator-tag">{t ? t.stack.top : 'TOP'}</span>}
                    </div>
                  ) : (
                    <div className="slot-placeholder" />
                  )}
                </div>

                {/* Right Pointer Indicator */}
                <div className="slot-pointer-track">
                  {isTop && (
                    <div className="pointer-arrow-pill">
                      <span className="pointer-arrow">◀</span>
                      <span className="pointer-text">top ({slotIdx})</span>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* Canister Base Plate */}
        <div className="canister-base">
          <span className="base-label">{t ? t.stack.base : 'TABAN (INDEX 0)'}</span>
        </div>
      </div>
    </div>
  );
};
