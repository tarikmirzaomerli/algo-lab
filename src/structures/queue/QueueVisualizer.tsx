import React from 'react';
import type { StepSnapshot } from '../../engine/types';
import type { QueueState } from './queueEngine';
import './QueueVisualizer.css';

interface QueueVisualizerProps {
  snapshot?: StepSnapshot<QueueState>;
  currentState: QueueState;
}

export const QueueVisualizer: React.FC<QueueVisualizerProps> = ({ snapshot, currentState }) => {
  const items = Array.isArray(snapshot?.structureState?.items)
    ? snapshot.structureState.items
    : (currentState?.items || []);
  const capacity = snapshot?.structureState?.capacity || currentState?.capacity || 7;
  const activeIds = snapshot?.activeIndicesOrNodes || [];
  const opType = snapshot?.operationType || 'idle';
  const frontPointer =
    snapshot?.pointers?.front !== undefined
      ? Number(snapshot.pointers.front)
      : items.length > 0
      ? 0
      : -1;
  const rearPointer =
    snapshot?.pointers?.rear !== undefined
      ? Number(snapshot.pointers.rear)
      : items.length > 0
      ? items.length - 1
      : -1;

  const slots = Array.from({ length: capacity }, (_, i) => i);

  return (
    <div className="queue-visualizer-container">
      {/* Top Status Ribbon */}
      <div className="queue-status-ribbon">
        <div className="queue-badge-pill">
          <span className="badge-dot" />
          <span>Kapasite: {items.length} / {capacity}</span>
        </div>
        <div className="queue-badge-pill secondary">
          <span>FIFO (First In First Out)</span>
        </div>
      </div>

      {/* Conveyor Stage */}
      <div className="conveyor-stage">
        {/* Left Egress Gate */}
        <div className="conveyor-gate egress">
          <div className="gate-icon">⬅</div>
          <span className="gate-label">ÇIKIŞ (FRONT)</span>
          <span className="gate-sub">Dequeue</span>
        </div>

        {/* Main Conveyor Tube */}
        <div className="conveyor-tube">
          <div className="tube-slots-track">
            {slots.map((slotIdx) => {
              const item = items[slotIdx];
              const isFront = slotIdx === frontPointer && frontPointer >= 0 && slotIdx < items.length;
              const isRear = slotIdx === rearPointer && rearPointer >= 0 && slotIdx < items.length;
              const isActive = item && activeIds.includes(item.id);
              const isEnqueuing = isActive && opType === 'enqueue';
              const isDequeuing = isActive && opType === 'dequeue';
              const isPeeking = isActive && opType === 'peek';

              let itemClass = 'conveyor-item';
              if (isEnqueuing) itemClass += ' item-enqueuing';
              else if (isDequeuing) itemClass += ' item-dequeuing';
              else if (isPeeking) itemClass += ' item-peeking';

              return (
                <div key={slotIdx} className="conveyor-slot-column">
                  {/* Top Pointer Indicator */}
                  <div className="slot-pointer-header">
                    {isFront && (
                      <div className="pointer-pill front-pill">
                        <span>front</span>
                        <span className="pill-arrow">▼</span>
                      </div>
                    )}
                    {isRear && !isFront && (
                      <div className="pointer-pill rear-pill">
                        <span>rear</span>
                        <span className="pill-arrow">▼</span>
                      </div>
                    )}
                    {isFront && isRear && (
                      <div className="pointer-pill dual-pill">
                        <span>f/r</span>
                        <span className="pill-arrow">▼</span>
                      </div>
                    )}
                  </div>

                  {/* Slot Cell */}
                  <div className="slot-box">
                    {item ? (
                      <div className={itemClass} key={item.id}>
                        <span className="item-value">{item.value}</span>
                      </div>
                    ) : (
                      <div className="slot-empty-ghost" />
                    )}
                  </div>

                  {/* Bottom Slot Index */}
                  <div className="slot-footer-index">[{slotIdx}]</div>
                </div>
              );
            })}
          </div>

          {/* Conveyor Mechanical Rail */}
          <div className="conveyor-rail">
            <div className="rail-treads" />
          </div>
        </div>

        {/* Right Ingress Gate */}
        <div className="conveyor-gate ingress">
          <div className="gate-icon">⬅</div>
          <span className="gate-label">GİRİŞ (REAR)</span>
          <span className="gate-sub">Enqueue</span>
        </div>
      </div>
    </div>
  );
};
