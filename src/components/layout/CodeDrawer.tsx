import React from 'react';
import type { VisualizerItemMetadata, StepSnapshot } from '../../engine/types';
import type { Language, Translations } from '../../i18n/translations';
import { X, Clock, HardDrive, Activity, Compass, CheckCircle2 } from 'lucide-react';
import './CodeDrawer.css';

interface CodeDrawerProps {
  metadata: VisualizerItemMetadata;
  currentSnapshot?: StepSnapshot;
  isOpen: boolean;
  onClose: () => void;
  lang: Language;
  t: Translations;
}

export const CodeDrawer: React.FC<CodeDrawerProps> = ({
  metadata,
  currentSnapshot,
  isOpen,
  onClose,
  lang,
  t,
}) => {
  const activeLine = currentSnapshot?.codeLine ?? 1;
  const metrics = currentSnapshot?.metrics;
  const pointers = currentSnapshot?.pointers || {};

  const getItemLocalizedName = (): string => {
    if (metadata.id === 'stack') return t.stack.name;
    if (metadata.id === 'queue') return t.queue.name;
    if (metadata.id === 'linked-list') return t.linkedList.name;
    if (metadata.id === 'bst') return t.bst.name;
    if (t.algoNames[metadata.id]) return t.algoNames[metadata.id].name;
    return metadata.name;
  };

  const getItemLocalizedDesc = (): string => {
    if (metadata.id === 'stack') return t.stack.desc;
    if (metadata.id === 'queue') return t.queue.desc;
    if (metadata.id === 'linked-list') return t.linkedList.desc;
    if (metadata.id === 'bst') return t.bst.desc;
    if (t.algoNames[metadata.id]) return t.algoNames[metadata.id].desc;
    return metadata.description;
  };

  const statusNote = currentSnapshot?.statusNote || getItemLocalizedDesc();

  return (
    <aside className={`code-drawer ${isOpen ? 'open' : 'closed'}`}>
      {/* Drawer Header */}
      <div className="drawer-header">
        <div className="drawer-title-group">
          <h2 className="drawer-title">{getItemLocalizedName()}</h2>
          <span className="drawer-kind-badge">
            {metadata.kind === 'structure'
              ? lang === 'tr'
                ? 'Veri Yapısı'
                : 'Data Structure'
              : lang === 'tr'
              ? 'Algoritma'
              : 'Algorithm'}
          </span>
        </div>
        <button onClick={onClose} className="drawer-close-btn" title={t.close} aria-label="Close drawer">
          <X size={18} />
        </button>
      </div>

      <div className="drawer-content-scroll">
        {/* 1. Contextual Micro-Narrative Status Note */}
        <div className="status-note-card">
          <div className="status-note-header">
            <Activity size={14} className="status-icon" />
            <span className="status-header-title">{t.liveStatus}</span>
          </div>
          <p className="status-note-text">{statusNote}</p>
        </div>

        {/* 2. Compact Live Metrics Grid */}
        <div className="metrics-grid">
          {/* Big-O Time */}
          <div className="metric-chip">
            <div className="metric-icon-wrap time">
              <Clock size={13} />
            </div>
            <div className="metric-info">
              <span className="metric-label">{t.timeComplexity}</span>
              <span className="metric-val">{metadata.complexity.time.average}</span>
            </div>
          </div>

          {/* Big-O Space */}
          <div className="metric-chip">
            <div className="metric-icon-wrap space">
              <HardDrive size={13} />
            </div>
            <div className="metric-info">
              <span className="metric-label">{t.spaceComplexity}</span>
              <span className="metric-val">{metadata.complexity.space}</span>
            </div>
          </div>

          {/* Comparisons */}
          <div className="metric-chip">
            <div className="metric-icon-wrap comp">
              <Activity size={13} />
            </div>
            <div className="metric-info">
              <span className="metric-label">{t.comparisons}</span>
              <span className="metric-val">{metrics?.comparisons ?? 0}</span>
            </div>
          </div>

          {/* Operations / Swaps */}
          <div className="metric-chip">
            <div className="metric-icon-wrap ops">
              <CheckCircle2 size={13} />
            </div>
            <div className="metric-info">
              <span className="metric-label">
                {metrics?.swaps !== undefined ? t.swaps : t.operations}
              </span>
              <span className="metric-val">
                {metrics?.swaps !== undefined ? metrics.swaps : (metrics?.operations ?? 0)}
              </span>
            </div>
          </div>
        </div>

        {/* 3. Active Pointers Badges */}
        {Object.keys(pointers).length > 0 && (
          <div className="pointers-section">
            <div className="section-title">
              <Compass size={13} />
              <span>{t.livePointers}</span>
            </div>
            <div className="pointer-badges-wrap">
              {Object.entries(pointers).map(([key, val]) => (
                <div key={key} className="pointer-chip">
                  <span className="pointer-key">{key}:</span>
                  <span className="pointer-val">{String(val)}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* 4. Synchronized Pseudocode */}
        <div className="pseudocode-section">
          <div className="section-title">
            <span>{t.pseudocodeTitle}</span>
          </div>

          <div className="pseudocode-box">
            {metadata.pseudocode.map((item) => {
              const isCurrent = item.line === activeLine;

              return (
                <div
                  key={item.line}
                  className={`code-line-row ${isCurrent ? 'active-code-line' : ''}`}
                >
                  <span className="line-num">{item.line}</span>
                  <span className="line-code">{item.code}</span>
                  {isCurrent && <span className="line-active-indicator">◀</span>}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </aside>
  );
};
