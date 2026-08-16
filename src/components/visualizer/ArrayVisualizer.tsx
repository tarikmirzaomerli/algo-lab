import React from 'react';
import type { AlgorithmStep } from '../../types/event';
import { isSearchMeta } from '../../types/event';
import { Layers } from 'lucide-react';
import { SearchVisualizer } from './SearchVisualizer';
import './ArrayVisualizer.css';

interface ArrayVisualizerProps {
  step?: AlgorithmStep;
  initialArray: number[];
  onRandomizeTarget?: () => void;
}

export const ArrayVisualizer: React.FC<ArrayVisualizerProps> = ({
  step,
  initialArray,
  onRandomizeTarget,
}) => {
  const isSearchStep = isSearchMeta(step?.meta);

  if (isSearchStep) {
    return (
      <SearchVisualizer
        step={step}
        initialArray={initialArray}
        onRandomizeTarget={onRandomizeTarget}
      />
    );
  }

  const currentArray =
    step && Array.isArray(step.arraySnapshot)
      ? step.arraySnapshot
      : Array.isArray(initialArray)
      ? initialArray
      : [];
  const maxValue = Math.max(...currentArray, 100);
  const totalCount = currentArray.length;

  const isIndexActive = (idx: number) => step?.indices?.includes(idx) ?? false;
  const isSorted = (idx: number) => step?.sortedIndices?.includes(idx) ?? false;
  const isPivot = (idx: number) => step?.pivotIndex === idx;
  const isInSubRange = (idx: number) => {
    if (!step?.subArrayRange) return false;
    const [start, end] = step.subArrayRange;
    return idx >= start && idx <= end;
  };

  const getBarStateClass = (idx: number) => {
    if (isPivot(idx)) return 'bar-pivot';
    if (!step) return 'bar-default';

    if (isIndexActive(idx)) {
      if (step.type === 'COMPARE') return 'bar-compare';
      if (step.type === 'SWAP' || step.type === 'OVERWRITE') return 'bar-swap';
      if (step.type === 'SELECT_MIN' || step.type === 'INSERT') return 'bar-active';
      if (step.type === 'PIVOT_SELECT') return 'bar-pivot';
    }

    if (isSorted(idx)) return 'bar-sorted';
    if (isInSubRange(idx)) return 'bar-subrange';

    return 'bar-default';
  };

  const getStateLabel = (stateClass: string) => {
    switch (stateClass) {
      case 'bar-compare': return 'Karşılaştırılıyor';
      case 'bar-swap': return 'Yer Değiştiriliyor';
      case 'bar-active': return 'Aktif / Seçili';
      case 'bar-pivot': return 'Pivot Eleman';
      case 'bar-sorted': return 'Sıralandı';
      case 'bar-subrange': return 'Alt Dizi İçinde';
      default: return 'Beklemede';
    }
  };

  const showValuesOnBars = totalCount <= 30;
  const showIndices = totalCount <= 40;

  return (
    <div className="visualizer-card glass-panel">
      <div className="visualizer-header">
        <div className="header-left">
          <h3>Görsel Simülasyon</h3>
          <span className="count-pill mono">
            {totalCount} Eleman
          </span>
          {step?.recursionFrame && (
            <div className="recursion-badge">
              <Layers size={14} />
              <span>Çağrı: <strong className="mono">{step.recursionFrame}</strong></span>
            </div>
          )}
        </div>

        <div className="visualizer-legend">
          <div className="legend-item">
            <span className="legend-dot default"></span>
            <span>Varsayılan</span>
          </div>
          <div className="legend-item">
            <span className="legend-dot compare"></span>
            <span>Karşılaştırma</span>
          </div>
          <div className="legend-item">
            <span className="legend-dot swap"></span>
            <span>Swap / Değişim</span>
          </div>
          <div className="legend-item">
            <span className="legend-dot pivot"></span>
            <span>Pivot</span>
          </div>
          <div className="legend-item">
            <span className="legend-dot sorted"></span>
            <span>Sıralandı</span>
          </div>
        </div>
      </div>

      <div className={`bars-container ${totalCount > 25 ? 'dense' : ''}`}>
        {currentArray.map((val, idx) => {
          const heightPercent = Math.max(8, Math.round((val / maxValue) * 100));
          const stateClass = getBarStateClass(idx);
          const pivotActive = isPivot(idx);
          const stateLabel = getStateLabel(stateClass);

          return (
            <div
              key={idx}
              className="bar-wrapper"
              title={`İndeks ${idx}: ${val}`}
              tabIndex={0}
              role="region"
              aria-label={`Eleman ${val}, İndeks ${idx}, Durum: ${stateLabel}`}
            >
              {pivotActive && <div className="pivot-indicator">PIVOT</div>}
              
              <div
                className={`bar ${stateClass}`}
                style={{ height: `${heightPercent}%` }}
              >
                {showValuesOnBars && (
                  <span className="bar-value mono">{val}</span>
                )}
              </div>
              {showIndices && <span className="bar-index mono">{idx}</span>}
            </div>
          );
        })}
      </div>

      {step?.subArrayRange && (
        <div className="subrange-info mono">
          Aktif Alt Dizi Aralığı: [{step.subArrayRange[0]} ... {step.subArrayRange[1]}]
        </div>
      )}
    </div>
  );
};
