import React from 'react';
import {
  RotateCcw,
  SkipBack,
  Play,
  Pause,
  SkipForward,
  Repeat,
  Gauge,
} from 'lucide-react';
import type { Translations } from '../../i18n/translations';
import './TransportDock.css';

interface TransportDockProps {
  isPlaying: boolean;
  currentStepIdx: number;
  totalSteps: number;
  speed: number;
  isLooping: boolean;
  t: Translations;
  onTogglePlay: () => void;
  onStepForward: () => void;
  onStepBackward: () => void;
  onReset: () => void;
  onJumpToStep: (idx: number) => void;
  onSetSpeed: (speed: number) => void;
  onToggleLoop: () => void;
}

export const TransportDock: React.FC<TransportDockProps> = ({
  isPlaying,
  currentStepIdx,
  totalSteps,
  speed,
  isLooping,
  t,
  onTogglePlay,
  onStepForward,
  onStepBackward,
  onReset,
  onJumpToStep,
  onSetSpeed,
  onToggleLoop,
}) => {
  const speeds = [0.5, 1, 2, 4];
  const maxStep = Math.max(0, totalSteps - 1);

  return (
    <footer className="transport-dock">
      {/* Playback Control Buttons */}
      <div className="dock-buttons-group">
        <button
          onClick={onReset}
          className="dock-btn secondary"
          title={`${t.reset} (Reset)`}
          disabled={totalSteps <= 1}
        >
          <RotateCcw size={18} />
        </button>

        <button
          onClick={onStepBackward}
          className="dock-btn secondary"
          title={`${t.stepBack} (←)`}
          disabled={currentStepIdx === 0 || totalSteps <= 1}
        >
          <SkipBack size={18} />
        </button>

        <button
          onClick={onTogglePlay}
          className={`dock-btn primary-play ${isPlaying ? 'playing' : ''}`}
          title={isPlaying ? `${t.pause} (Space)` : `${t.play} (Space)`}
          disabled={totalSteps <= 1}
        >
          {isPlaying ? <Pause size={20} /> : <Play size={20} className="play-icon" />}
        </button>

        <button
          onClick={onStepForward}
          className="dock-btn secondary"
          title={`${t.stepForward} (→)`}
          disabled={currentStepIdx >= maxStep || totalSteps <= 1}
        >
          <SkipForward size={18} />
        </button>
      </div>

      {/* Scrubber Timeline Slider */}
      <div className="dock-timeline-group">
        <div className="timeline-step-badge">
          <span className="step-label">{t.step}</span>
          <span className="step-value">
            {totalSteps > 0 ? currentStepIdx + 1 : 0} <span className="step-total">/ {totalSteps}</span>
          </span>
        </div>

        <div className="timeline-slider-track">
          <input
            type="range"
            min={0}
            max={maxStep}
            value={currentStepIdx}
            onChange={(e) => onJumpToStep(Number(e.target.value))}
            className="timeline-slider"
            disabled={totalSteps <= 1}
          />
        </div>
      </div>

      {/* Speed Selector & Auto Loop */}
      <div className="dock-settings-group">
        <div className="speed-pills-list">
          <Gauge size={14} className="speed-icon" />
          {speeds.map((s) => (
            <button
              key={s}
              onClick={() => onSetSpeed(s)}
              className={`speed-pill ${speed === s ? 'active' : ''}`}
            >
              {s}x
            </button>
          ))}
        </div>

        <button
          onClick={onToggleLoop}
          className={`dock-btn loop-btn ${isLooping ? 'active' : ''}`}
          title={isLooping ? t.loopOn : t.loopOff}
        >
          <Repeat size={16} />
        </button>
      </div>
    </footer>
  );
};
