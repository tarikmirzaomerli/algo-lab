import React from 'react';
import type { StepSnapshot } from '../../engine/types';
import type { ArrayAlgorithmState } from '../../algorithms/sorting/bubbleSort';
import './ArrayVisualizer.css';

interface ArrayVisualizerProps {
  snapshot?: StepSnapshot<ArrayAlgorithmState>;
  initialArray: number[];
}

export const ArrayVisualizer: React.FC<ArrayVisualizerProps> = ({
  snapshot,
  initialArray,
}) => {
  const arrayToRender = Array.isArray(snapshot?.structureState?.array)
    ? snapshot.structureState.array
    : initialArray;
  const sortedIndices = Array.isArray(snapshot?.structureState?.sortedIndices)
    ? snapshot.structureState.sortedIndices
    : [];
  const activeIndices = (snapshot?.activeIndicesOrNodes || []).map(Number);
  const secondaryIndices = (snapshot?.secondaryIndicesOrNodes || []).map(Number);
  const opType = snapshot?.operationType || 'idle';
  const pointers = snapshot?.pointers || {};

  const maxVal = Math.max(...arrayToRender, 100);

  // Group pointers by array index
  const pointersByIndex: Record<number, string[]> = {};
  Object.entries(pointers).forEach(([key, val]) => {
    const numericVal = Number(val);
    if (!isNaN(numericVal) && numericVal >= 0 && numericVal < arrayToRender.length) {
      if (!pointersByIndex[numericVal]) pointersByIndex[numericVal] = [];
      pointersByIndex[numericVal].push(key);
    }
  });

  return (
    <div className="array-visualizer-container">
      {/* Top Status Ribbon */}
      <div className="array-status-ribbon">
        <div className="array-badge-pill">
          <span className="badge-dot" />
          <span>Eleman Sayısı: {arrayToRender.length}</span>
        </div>
        <div className="array-badge-pill secondary">
          <span>Maksimum Değer: {Math.max(...arrayToRender, 0)}</span>
        </div>
      </div>

      {/* Main Bar Chart Stage */}
      <div className="array-bars-stage">
        {arrayToRender.map((value, idx) => {
          const isSorted = sortedIndices.includes(idx);
          const isActive = activeIndices.includes(idx);
          const isSecondary = secondaryIndices.includes(idx);

          const isComparing = isActive && opType === 'compare';
          const isSwapping = isActive && (opType === 'swap' || opType === 'overwrite');
          const isFound = isActive && opType === 'found';

          let barClass = 'array-bar';
          if (isFound) barClass += ' bar-found';
          else if (isSwapping) barClass += ' bar-swapping';
          else if (isComparing) barClass += ' bar-comparing';
          else if (isSorted) barClass += ' bar-sorted';
          else if (isSecondary) barClass += ' bar-secondary';

          const heightPercent = Math.max(12, Math.round((value / maxVal) * 100));
          const indexPointers = pointersByIndex[idx] || [];

          return (
            <div key={idx} className="bar-column">
              {/* Floating Pointer Badges Above Bar */}
              <div className="pointer-stack-area">
                {indexPointers.map((pName) => (
                  <div key={pName} className="bar-pointer-chip">
                    <span>{pName}</span>
                    <span className="pointer-chevron">▼</span>
                  </div>
                ))}
              </div>

              {/* Bar Box */}
              <div
                className={barClass}
                style={{ height: `${heightPercent}%` }}
              >
                <span className="bar-value-label">{value}</span>
              </div>

              {/* Index Subtitle */}
              <div className="bar-index-label">[{idx}]</div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
