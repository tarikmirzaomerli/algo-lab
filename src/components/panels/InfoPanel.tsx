import React from 'react';
import type { AlgorithmMetadata } from '../../types/algorithm';
import { BookOpen, Globe, Check, X, ShieldCheck } from 'lucide-react';
import './InfoPanel.css';

interface InfoPanelProps {
  metadata: AlgorithmMetadata;
}

export const InfoPanel: React.FC<InfoPanelProps> = ({ metadata }) => {
  return (
    <div className="info-panel glass-panel">
      <div className="info-header">
        <h2>{metadata.name}</h2>
        <p className="description">{metadata.description}</p>
      </div>

      {/* How it Works Section */}
      <div className="info-section">
        <div className="section-title">
          <BookOpen size={16} />
          <span>Algoritma Nasıl Çalışır?</span>
        </div>
        <ol className="how-it-works-list">
          {metadata.howItWorks.map((stepText, idx) => (
            <li key={idx}>
              <span className="step-num">{idx + 1}</span>
              <span className="step-text">{stepText}</span>
            </li>
          ))}
        </ol>
      </div>

      {/* Real World Applications Section */}
      <div className="info-section real-world-section">
        <div className="section-title title-globe">
          <Globe size={16} />
          <span>Gerçek Hayatta Nerede ve Neden Kullanılır?</span>
        </div>
        <div className="real-world-list">
          {metadata.realWorldApplications.map((appText, idx) => (
            <div key={idx} className="real-world-item">
              <p>{appText}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Properties Summary */}
      <div className="info-section properties-section">
        <div className="section-title title-props">
          <ShieldCheck size={16} />
          <span>Temel Algoritma Özellikleri</span>
        </div>
        <div className="properties-grid mono">
          <div className="property-item">
            <span className="prop-label">Kararlılık (Stable):</span>
            {metadata.properties.stable ? (
              <span className="prop-yes"><Check size={14} /> Evet (Eşit elemanların sırasını korur)</span>
            ) : (
              <span className="prop-no"><X size={14} /> Hayır (Eşit elemanlar yer değiştirebilir)</span>
            )}
          </div>
          <div className="property-item">
            <span className="prop-label">Yerinde (In-Place):</span>
            {metadata.properties.inPlace ? (
              <span className="prop-yes"><Check size={14} /> Evet (Ekstra bellek gerekmez - O(1))</span>
            ) : (
              <span className="prop-no"><X size={14} /> Hayır (Ek dizi / bellek alanı kullanır)</span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
