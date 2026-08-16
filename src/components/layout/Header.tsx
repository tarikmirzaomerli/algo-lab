import React from 'react';
import { Sparkles, BookOpen, Layers } from 'lucide-react';
import './Header.css';

export const Header: React.FC = () => {
  return (
    <header className="app-header">
      <div className="header-brand">
        <div className="logo-icon">
          <Sparkles className="icon" size={24} />
        </div>
        <div className="brand-text">
          <h1>AlgoLab</h1>
          <span>Algoritma Öğrenme & Görselleştirme</span>
        </div>
      </div>

      <div className="header-meta">
        <div className="category-pill">
          <Layers size={16} />
          <span>Modül: Sıralama Algoritmaları</span>
        </div>
        <div className="mode-pill">
          <BookOpen size={16} />
          <span>Eğitim Modu</span>
        </div>
      </div>
    </header>
  );
};
