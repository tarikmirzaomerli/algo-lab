import React from 'react';
import type { AlgorithmStep } from '../../types/event';
import { Layers, Target, RefreshCw, Info, Check } from 'lucide-react';

interface SearchVisualizerProps {
  step?: AlgorithmStep;
  initialArray: number[];
  onRandomizeTarget?: () => void;
}

export const SearchVisualizer: React.FC<SearchVisualizerProps> = ({
  step,
  initialArray,
  onRandomizeTarget,
}) => {

  const currentArray =
    step && Array.isArray(step.arraySnapshot)
      ? step.arraySnapshot
      : Array.isArray(initialArray)
      ? initialArray
      : [];
  const totalCount = currentArray.length;

  const targetValue =
    step && Array.isArray(step.values)
      ? step.values[1] ?? step.values[0]
      : undefined;
  const isComplete = step?.type === 'COMPLETE';
  const isFound = isComplete && ((step?.sortedIndices?.length ?? 0) > 0);
  const foundIndex =
    isFound && step && Array.isArray(step.sortedIndices) ? step.sortedIndices[0] : -1;
  const activeIndex =
    step && step.type === 'COMPARE' && Array.isArray(step.indices) && step.indices.length > 0
      ? step.indices[0]
      : -1;

  const meta = step?.meta;
  const metaKind = meta?.kind;

  const isBinarySearch = metaKind === 'binary-search';
  const isJumpSearch = metaKind === 'jump-search';
  const isExponentialSearch = metaKind === 'exponential-search';
  const isInterpolationSearch = metaKind === 'interpolation-search';

  const low = meta && 'low' in meta ? meta.low : undefined;
  const mid = meta && 'mid' in meta ? meta.mid : undefined;
  const high = meta && 'high' in meta ? meta.high : undefined;

  const blockSize = meta?.kind === 'jump-search' ? meta.blockSize : undefined;
  const blockStart = meta?.kind === 'jump-search' ? meta.blockStart : undefined;
  const blockEnd = meta?.kind === 'jump-search' ? meta.blockEnd : undefined;

  const boundIndex = meta?.kind === 'exponential-search' ? meta.boundIndex : undefined;
  const previousBound = meta?.kind === 'exponential-search' ? meta.previousBound : undefined;

  const probe = meta?.kind === 'interpolation-search' ? meta.probe : undefined;
  const phase = meta && 'phase' in meta ? meta.phase : undefined;

  const algoDisplayName = isInterpolationSearch
    ? 'Interpolation Search'
    : isExponentialSearch
    ? 'Exponential Search'
    : isJumpSearch
    ? 'Jump Search'
    : isBinarySearch
    ? 'Binary Search'
    : 'Linear Search';

  const getCardStateClass = (idx: number) => {
    if (!step) return 'card-default';

    if (step.sortedIndices.includes(idx)) {
      return 'card-found';
    }

    if (isInterpolationSearch) {
      if (idx === probe && step.type === 'COMPARE') {
        return 'card-active';
      }
      if (low !== undefined && high !== undefined) {
        if (idx < low || idx > high) {
          return 'card-visited';
        }
      }
      return 'card-default';
    }

    if (isExponentialSearch) {
      if (phase === 'BOUND') {
        if (step.indices.includes(idx) && step.type === 'COMPARE') {
          return 'card-active';
        }
        if (previousBound !== undefined && idx < previousBound) {
          return 'card-visited';
        }
        return 'card-default';
      } else {
        // BINARY phase
        if (idx === mid && step.type === 'COMPARE') {
          return 'card-active';
        }
        if (low !== undefined && high !== undefined) {
          if (idx < low || idx > high) {
            return 'card-visited';
          }
        }
        return 'card-default';
      }
    }

    if (isJumpSearch) {
      if (phase === 'jump') {
        if (step.indices.includes(idx) && step.type === 'COMPARE') {
          return 'card-active';
        }
        if (blockEnd !== undefined && idx < blockStart!) {
          return 'card-visited';
        }
        return 'card-default';
      } else {
        // linear phase within block
        if (step.indices.includes(idx) && step.type === 'COMPARE') {
          return 'card-active';
        }
        if (blockStart !== undefined && blockEnd !== undefined) {
          if (idx < blockStart || idx > blockEnd) {
            return 'card-visited';
          }
          if (activeIndex !== -1 && idx < activeIndex) {
            return 'card-visited';
          }
        }
        return 'card-default';
      }
    }

    if (isBinarySearch) {
      if (idx === mid && step.type === 'COMPARE') {
        return 'card-active';
      }
      if (low !== undefined && high !== undefined) {
        if (idx < low || idx > high) {
          return 'card-visited';
        }
      }
      return 'card-default';
    }

    if (step.indices.includes(idx) && step.type === 'COMPARE') {
      return 'card-active';
    }

    if (isComplete) {
      if (isFound) {
        if (idx < foundIndex) return 'card-visited';
      } else {
        return 'card-visited';
      }
    } else if (step.type === 'COMPARE' && activeIndex !== -1) {
      if (idx < activeIndex) return 'card-visited';
    }

    return 'card-default';
  };

  const getCardStateLabel = (stateClass: string) => {
    switch (stateClass) {
      case 'card-active':
        if (isInterpolationSearch) {
          return 'P (Tahmin Edilen Konum)';
        }
        if (isExponentialSearch) {
          return phase === 'BOUND' ? 'Sınır Kontrolü' : 'Mid (Ortadaki)';
        }
        if (isJumpSearch) {
          return phase === 'jump' ? 'Sıçrama Noktası' : 'Blok İçi İnceleniyor';
        }
        return isBinarySearch ? 'Mid (Ortadaki)' : 'İnceleniyor';
      case 'card-found': return 'Hedef Bulundu';
      case 'card-visited':
        if (isInterpolationSearch) {
          return 'Elendi (Aralık Dışı)';
        }
        if (isExponentialSearch) {
          return phase === 'BOUND' ? 'Aşılmış Sınır' : 'Aralık Dışı / Elendi';
        }
        if (isJumpSearch) {
          return phase === 'jump' ? 'Geçilmiş Blok' : 'Blok Dışı / Kontrol Edildi';
        }
        return isBinarySearch ? 'Elendi (Aralık Dışı)' : 'Kontrol Edildi';
      default:
        if (isInterpolationSearch) {
          return 'Arama Aralığında';
        }
        if (isExponentialSearch) {
          return phase === 'BOUND' ? 'Gelecek Sınır' : 'Arama Aralığında';
        }
        if (isJumpSearch) {
          return phase === 'jump' ? 'Gelecek Blok' : 'Aktif Blokta';
        }
        return isBinarySearch ? 'Arama Aralığında' : 'Henüz Bakılmadı';
    }
  };

  let checkedCount = 0;
  if (isComplete) {
    checkedCount = isFound ? foundIndex + 1 : totalCount;
  } else if (activeIndex !== -1) {
    checkedCount = activeIndex + 1;
  }
  const progressPercent = totalCount > 0 ? Math.min(100, Math.round((checkedCount / totalCount) * 100)) : 0;

  const rangeSize =
    isBinarySearch && low !== undefined && high !== undefined && high >= low
      ? high - low + 1
      : isJumpSearch && blockStart !== undefined && blockEnd !== undefined && blockEnd >= blockStart
      ? blockEnd - blockStart + 1
      : isExponentialSearch && low !== undefined && high !== undefined && high >= low
      ? high - low + 1
      : isInterpolationSearch && low !== undefined && high !== undefined && high >= low
      ? high - low + 1
      : 0;
  const rangePercent = totalCount > 0 ? Math.round((rangeSize / totalCount) * 100) : 0;

  const getLegendText = (type: 'default' | 'compare' | 'visited' | 'sorted') => {
    if (isInterpolationSearch) {
      switch (type) {
        case 'default': return 'Arama Alanı';
        case 'compare': return 'Tahmin Edilen (P)';
        case 'visited': return 'Elendi (Aralık Dışı)';
        case 'sorted': return 'Hedef Bulundu';
      }
    }
    if (isExponentialSearch) {
      switch (type) {
        case 'default': return 'Arama Alanı';
        case 'compare': return 'Sınır / Mid';
        case 'visited': return 'Elenen';
        case 'sorted': return 'Hedef Bulundu';
      }
    }
    if (isJumpSearch) {
      switch (type) {
        case 'default': return 'Gelecek Blok';
        case 'compare': return 'Sıçrama / Blok İçi';
        case 'visited': return 'Atlanan / Elenen';
        case 'sorted': return 'Hedef Bulundu';
      }
    }
    if (isBinarySearch) {
      switch (type) {
        case 'default': return 'Aktif Aralık';
        case 'compare': return 'Mid (Ortadaki)';
        case 'visited': return 'Elendi (Aralık Dışı)';
        case 'sorted': return 'Hedef Bulundu';
      }
    }
    switch (type) {
      case 'default': return 'Henüz Bakılmadı';
      case 'compare': return 'İnceleniyor';
      case 'visited': return 'Kontrol Edildi';
      case 'sorted': return 'Hedef Bulundu';
    }
  };

  return (
    <div className="visualizer-card search-visualizer-card glass-panel">
      {/* Visualizer Header */}
      <div className="visualizer-header">
        <div className="header-left">
          <h3>Görsel Simülasyon</h3>
          <span className="count-pill mono">
            {totalCount} Eleman
          </span>
          {targetValue !== undefined && (
            <div className="target-pill-group">
              <div className="target-pill" title={`Aranan Hedef Değer: ${targetValue}`}>
                <Target size={14} className="target-icon" />
                <span>Hedef: <strong className="mono">{targetValue}</strong></span>
              </div>
              {onRandomizeTarget && (
                <button
                  type="button"
                  className="new-target-btn glass-button"
                  onClick={onRandomizeTarget}
                  title="Dizi içerisinden rastgele yeni bir hedef seç"
                  aria-label="Yeni hedef değer seç"
                >
                  <RefreshCw size={13} />
                  <span>Yeni Hedef</span>
                </button>
              )}
            </div>
          )}
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
            <span>{getLegendText('default')}</span>
          </div>
          <div className="legend-item">
            <span className="legend-dot compare"></span>
            <span>{getLegendText('compare')}</span>
          </div>
          <div className="legend-item">
            <span className="legend-dot visited"></span>
            <span>{getLegendText('visited')}</span>
          </div>
          <div className="legend-item">
            <span className="legend-dot sorted"></span>
            <span>{getLegendText('sorted')}</span>
          </div>
        </div>
      </div>

      {/* Sıralı Dizi Bilgilendirme Banner'ı */}
      {(isJumpSearch || isExponentialSearch || isInterpolationSearch) && (
        <div className="sorted-array-notice-banner glass-panel mono" role="status" aria-live="polite">
          <Info size={15} className="banner-icon text-blue" />
          <span>
            <strong>ℹ️ {algoDisplayName}</strong> sıralı veri seti gerektirir. Aramanın gerçekleştirilebilmesi için dizinin çalışma kopyası küçükten büyüğe sıralandı. <em>(Orijinal diziniz değiştirilmedi)</em>
          </span>
        </div>
      )}

      {/* Progress Bar Area */}
      {step && (
        <div className="search-progress-wrapper mono">
          <div className="search-progress-labels">
            {isInterpolationSearch ? (
              <>
                <span>Tahmin Edilen Konum (P): İndeks {probe ?? '-'}</span>
                <span>
                  {low !== undefined && high !== undefined && high >= low
                    ? `[İndeks ${low} .. ${high}] (${rangeSize} Eleman - %${rangePercent})`
                    : 'Aralık Sonlandı'}
                </span>
              </>
            ) : isExponentialSearch ? (
              <>
                <span>{phase === 'BOUND' ? 'Arama Sınırı Belirleniyor' : 'Aktif İkili Arama Aralığı'}</span>
                <span>
                  {phase === 'BOUND'
                    ? `[İndeks ${previousBound ?? 0} .. ${Math.min(boundIndex ?? 0, totalCount - 1)}] (Sınır: ${boundIndex ?? 0})`
                    : low !== undefined && high !== undefined && high >= low
                    ? `[İndeks ${low} .. ${high}] (${rangeSize} Eleman - %${rangePercent})`
                    : 'Tarama Tamamlandı'}
                </span>
              </>
            ) : isJumpSearch ? (
              <>
                <span>Aktif Arama Bloğu</span>
                <span>
                  {blockStart !== undefined && blockEnd !== undefined && blockEnd >= blockStart
                    ? `[İndeks ${blockStart} .. ${blockEnd}] (Blok Boyutu: ${blockSize})`
                    : 'Tarama Tamamlandı'}
                </span>
              </>
            ) : isBinarySearch ? (
              <>
                <span>Aktif Arama Aralığı</span>
                <span>
                  {low !== undefined && high !== undefined && high >= low
                    ? `[İndeks ${low} .. ${high}] (${rangeSize} Eleman - %${rangePercent})`
                    : 'Aralık Sonlandı'}
                </span>
              </>
            ) : (
              <>
                <span>Tarama İlerlemesi</span>
                <span>{checkedCount} / {totalCount} ({progressPercent}%)</span>
              </>
            )}
          </div>
          <div className="search-progress-track">
            {(isBinarySearch && low !== undefined && high !== undefined && high >= low) ||
            (isJumpSearch && blockStart !== undefined && blockEnd !== undefined && blockEnd >= blockStart) ||
            (isInterpolationSearch && low !== undefined && high !== undefined && high >= low) ||
            (isExponentialSearch &&
              ((phase === 'BOUND' && boundIndex !== undefined) ||
                (phase === 'BINARY' && low !== undefined && high !== undefined && high >= low))) ? (
              <div
                className="search-progress-fill binary-range-fill"
                style={{
                  left: `${(
                    (isInterpolationSearch
                      ? low!
                      : isExponentialSearch
                      ? phase === 'BOUND'
                        ? previousBound ?? 0
                        : low!
                      : isBinarySearch
                      ? low!
                      : blockStart!) / totalCount
                  ) * 100}%`,
                  width: `${(
                    (isInterpolationSearch
                      ? high! - low! + 1
                      : isExponentialSearch
                      ? phase === 'BOUND'
                        ? Math.min(boundIndex ?? 0, totalCount - 1) - (previousBound ?? 0) + 1
                        : high! - low! + 1
                      : isBinarySearch
                      ? high! - low! + 1
                      : blockEnd! - blockStart! + 1) / totalCount
                  ) * 100}%`,
                  position: 'relative',
                }}
              ></div>
            ) : (
              <div
                className="search-progress-fill"
                style={{ width: `${progressPercent}%` }}
              ></div>
            )}
          </div>
        </div>
      )}

      {/* Search Cards Area */}
      <div className="search-cards-container">
        {currentArray.map((val, idx) => {
          const stateClass = getCardStateClass(idx);
          const stateLabel = getCardStateLabel(stateClass);

          const isLow = (isBinarySearch || isInterpolationSearch || (isExponentialSearch && phase === 'BINARY')) && idx === low;
          const isMid = (isBinarySearch || (isExponentialSearch && phase === 'BINARY')) && idx === mid;
          const isHigh = (isBinarySearch || isInterpolationSearch || (isExponentialSearch && phase === 'BINARY')) && idx === high;
          const isProbe = isInterpolationSearch && idx === probe;

          const isJumpPoint = isJumpSearch && phase === 'jump' && (step?.indices.includes(idx) ?? false);
          const isBlockBoundary =
            isJumpSearch &&
            blockStart !== undefined &&
            blockEnd !== undefined &&
            (idx === blockStart || idx === blockEnd);

          const isBoundPoint = isExponentialSearch && phase === 'BOUND' && idx === boundIndex;
          const isPrevBoundPoint = isExponentialSearch && phase === 'BOUND' && idx === previousBound;

          return (
            <div
              key={idx}
              className="search-card-wrapper"
              tabIndex={0}
              role="region"
              aria-label={`Eleman ${val}, İndeks ${idx}, Durum: ${stateLabel}`}
            >
              <div className={`search-card ${stateClass}`}>
                {stateClass === 'card-found' && (
                  <Check size={13} className="card-check-icon" aria-hidden="true" />
                )}
                <span className="search-card-val mono">{val}</span>
              </div>
              <span className="search-card-idx mono">{idx}</span>

              {isInterpolationSearch && (isLow || isProbe || isHigh) && (
                <div className="binary-pointer-badges mono">
                  {isLow && <span className="pointer-badge low" title="Alt (Arama Başlangıcı)">ALT</span>}
                  {isProbe && <span className="pointer-badge probe" title="Tahmin Edilen Konum">TAHMİN</span>}
                  {isHigh && <span className="pointer-badge high" title="Üst (Arama Bitişi)">ÜST</span>}
                </div>
              )}

              {(isBinarySearch || (isExponentialSearch && phase === 'BINARY')) && (isLow || isMid || isHigh) && (
                <div className="binary-pointer-badges mono">
                  {isLow && <span className="pointer-badge low" title="Alt (Arama Başlangıcı)">ALT</span>}
                  {isMid && <span className="pointer-badge mid" title="Orta (Ortadaki Eleman)">ORTA</span>}
                  {isHigh && <span className="pointer-badge high" title="Üst (Arama Bitişi)">ÜST</span>}
                </div>
              )}

              {isExponentialSearch && phase === 'BOUND' && (isBoundPoint || isPrevBoundPoint) && (
                <div className="binary-pointer-badges mono">
                  {isBoundPoint && (
                    <span className="pointer-badge bound" title="Aktif Sınır (Bound)">SINIR</span>
                  )}
                  {!isBoundPoint && isPrevBoundPoint && (
                    <span className="pointer-badge prev" title="Önceki Sınır (Prev)">ÖNCEKİ</span>
                  )}
                </div>
              )}

              {isJumpSearch && (isJumpPoint || isBlockBoundary) && (
                <div className="binary-pointer-badges mono">
                  {isJumpPoint && (
                    <span className="pointer-badge jump" title="Sıçrama Noktası">SIÇRAMA</span>
                  )}
                  {!isJumpPoint && isBlockBoundary && (
                    <span className="pointer-badge block" title="Aktif Blok Sınırı">BLOK</span>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

