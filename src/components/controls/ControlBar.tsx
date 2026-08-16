import React, { useState } from 'react';
import { createPortal } from 'react-dom';
import type { DataPreset } from '../../utils/arrayGenerator';
import {
  Play,
  Pause,
  RotateCcw,
  Gauge,
  Sliders,
  Shuffle,
  Edit3,
  ChevronLeft,
  ChevronRight,
  ListOrdered,
  X,
} from 'lucide-react';
import './ControlBar.css';

interface ControlBarProps {
  isPlaying: boolean;
  speed: number;
  arraySize: number;
  preset: DataPreset;
  currentStepIdx: number;
  totalSteps: number;
  onTogglePlay: () => void;
  onStepForward: () => void;
  onStepBackward: () => void;
  onRestart: () => void;
  onSetSpeed: (speed: number) => void;
  onSetArraySize: (size: number) => void;
  onGenerateData: (preset: DataPreset, customInput?: number[]) => void;
}

export const ControlBar: React.FC<ControlBarProps> = ({
  isPlaying,
  speed,
  arraySize,
  preset,
  currentStepIdx,
  totalSteps,
  onTogglePlay,
  onStepForward,
  onStepBackward,
  onRestart,
  onSetSpeed,
  onSetArraySize,
  onGenerateData,
}) => {
  const [showManualModal, setShowManualModal] = useState(false);
  const [customText, setCustomText] = useState('8, 3, 5, 1, 6, 9, 2, 7');
  const [errorMsg, setErrorMsg] = useState('');

  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && showManualModal) {
        setShowManualModal(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [showManualModal]);

  const speeds = [0.25, 0.5, 1, 2, 4];
  const presets: { id: DataPreset; label: string }[] = [
    { id: 'random', label: 'Rastgele' },
    { id: 'sorted', label: 'Sıralı' },
    { id: 'reverse', label: 'Ters Sıralı' },
    { id: 'nearly-sorted', label: 'Yaklaşık Sıralı' },
    { id: 'duplicates', label: 'Tekrarlı' },
  ];

  const sampleCustomArrays = [
    { label: 'Örnek 1', text: '8, 3, 5, 1, 6, 9' },
    { label: 'Örnek 2', text: '42, 15, 88, 3, 27, 60' },
    { label: 'Örnek 3 (Tekrarlı)', text: '5, 2, 5, 1, 2, 8' },
  ];

  const parsedNumbers = customText
    .split(/[,;\s]+/)
    .map((val) => parseInt(val.trim(), 10))
    .filter((val) => !isNaN(val));

  const handleManualSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    if (parsedNumbers.length === 0) {
      setErrorMsg('Lütfen geçerli sayılar girin (ör: 8, 3, 5, 1).');
      return;
    }

    if (parsedNumbers.length > 50) {
      setErrorMsg('Maksimum 50 eleman girebilirsiniz.');
      return;
    }

    onGenerateData('custom', parsedNumbers);
    setShowManualModal(false);
  };

  const modalJSX = (
    <div
      className="modal-backdrop"
      onClick={() => setShowManualModal(false)}
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-title"
    >
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <div className="modal-title-group">
            <ListOrdered size={22} className="modal-icon" />
            <h3 id="modal-title">Özel Dizi Girin</h3>
          </div>
          <button
            className="btn-close-modal"
            onClick={() => setShowManualModal(false)}
            aria-label="Pencereyi kapat"
          >
            <X size={20} />
          </button>
        </div>

        <p className="modal-desc">
          Görselleştirmek istediğiniz sayıları aralarında virgül veya boşluk bırakarak yazın.
        </p>

        <div className="sample-chips">
          <span className="chips-label">Hızlı Örnekler:</span>
          {sampleCustomArrays.map((sample, idx) => (
            <button
              key={idx}
              type="button"
              className="chip-btn mono"
              onClick={() => setCustomText(sample.text)}
              aria-label={`Örnek yükle: ${sample.label}`}
            >
              {sample.label}
            </button>
          ))}
        </div>

        <form onSubmit={handleManualSubmit}>
          <textarea
            value={customText}
            onChange={(e) => setCustomText(e.target.value)}
            placeholder="Örn: 8, 3, 5, 1, 6, 9, 2, 7"
            className="custom-textarea mono"
            rows={3}
            aria-label="Özel sayı listesi (virgül ile ayrılmış)"
          />

          <div className="input-meta-bar">
            <span className="live-count mono">
              {parsedNumbers.length > 0
                ? `✓ ${parsedNumbers.length} sayı algılandı`
                : 'Henüz sayı girilmedi'}
            </span>
          </div>

          {errorMsg && <p className="error-msg" role="alert">{errorMsg}</p>}

          <div className="modal-actions">
            <button
              type="button"
              className="btn-secondary"
              onClick={() => setShowManualModal(false)}
              aria-label="Özel dizi girmeyi vazgeç"
            >
              Vazgeç
            </button>
            <button type="submit" className="btn-primary" aria-label="Özel diziyi uygula ve simülasyonu başlat">
              Diziyi Uygula & Başlat
            </button>
          </div>
        </form>
      </div>
    </div>
  );

  return (
    <div className="control-bar glass-panel" role="region" aria-label="Simülasyon Kontrol Çubuğu">
      {/* Primary Playback Controls */}
      <div className="control-group playback-group">
        <button
          className="btn-control btn-restart"
          onClick={onRestart}
          title="Simülasyonu en başa döndürür"
        >
          <RotateCcw size={16} />
          <span>Sıfırla</span>
        </button>

        <button
          className="btn-control btn-step"
          onClick={onStepBackward}
          disabled={currentStepIdx === 0}
          title="Bir önceki adıma döner"
          aria-disabled={currentStepIdx === 0}
        >
          <ChevronLeft size={18} />
          <span>Önceki Adım</span>
        </button>

        <button
          className={`btn-control btn-play ${isPlaying ? 'playing' : ''}`}
          onClick={onTogglePlay}
          title={isPlaying ? 'Animasyonu durdurur' : 'Animasyonu otomatik başlatır'}
          aria-pressed={isPlaying}
        >
          {isPlaying ? <Pause size={18} /> : <Play size={18} className="play-icon" />}
          <span>{isPlaying ? 'Durdur' : 'Oynat'}</span>
        </button>

        <button
          className="btn-control btn-step"
          onClick={onStepForward}
          disabled={currentStepIdx >= totalSteps - 1}
          title="Bir sonraki adıma ilerler"
          aria-disabled={currentStepIdx >= totalSteps - 1}
        >
          <span>Sonraki Adım</span>
          <ChevronRight size={18} />
        </button>

        <div className="step-indicator-badge mono" aria-label={`Mevcut adım ${currentStepIdx + 1} / toplam ${totalSteps}`}>
          Adım <strong>{currentStepIdx + 1}</strong> / {totalSteps}
        </div>
      </div>

      <div className="divider"></div>

      {/* Speed Controls */}
      <div className="control-group speed-group">
        <div className="group-label">
          <Gauge size={14} />
          <span>Animasyon Hızı:</span>
        </div>
        <div className="speed-pills" role="group" aria-label="Animasyon Hızı Seçenekleri">
          {speeds.map((s) => (
            <button
              key={s}
              className={`speed-pill ${speed === s ? 'active' : ''}`}
              onClick={() => onSetSpeed(s)}
              aria-pressed={speed === s}
            >
              {s}x
            </button>
          ))}
        </div>
      </div>

      <div className="divider"></div>

      {/* Data Presets & Size Slider */}
      <div className="control-group data-group">
        <div className="preset-buttons" role="group" aria-label="Hazır Veri Seti Seçenekleri">
          {presets.map((p) => (
            <button
              key={p.id}
              className={`preset-btn ${preset === p.id ? 'active' : ''}`}
              onClick={() => onGenerateData(p.id)}
              aria-pressed={preset === p.id}
            >
              {p.id === 'random' && <Shuffle size={13} />}
              <span>{p.label}</span>
            </button>
          ))}

          <button
            className={`preset-btn btn-custom-trigger ${preset === 'custom' ? 'active' : ''}`}
            onClick={() => setShowManualModal(true)}
            title="Kendi sayı dizinizi manuel olarak girmek için tıklayın"
            aria-pressed={preset === 'custom'}
          >
            <Edit3 size={13} />
            <span>✏️ Özel Dizi Girin</span>
          </button>
        </div>

        <div className="size-slider-wrapper">
          <div className="slider-label">
            <Sliders size={14} />
            <span>Dizi Boyutu: <strong className="mono">{arraySize}</strong></span>
          </div>
          <input
            type="range"
            min={5}
            max={50}
            value={arraySize}
            onChange={(e) => onSetArraySize(parseInt(e.target.value, 10))}
            className="size-slider"
            aria-label="Dizi eleman sayısı"
            aria-valuemin={5}
            aria-valuemax={50}
            aria-valuenow={arraySize}
          />
        </div>
      </div>

      {/* Render Modal into document.body using React Portal for true viewport centering */}
      {showManualModal && createPortal(modalJSX, document.body)}
    </div>
  );
};
