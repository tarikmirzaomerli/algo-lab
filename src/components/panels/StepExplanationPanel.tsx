import React from 'react';
import type { AlgorithmStep } from '../../types/event';
import type { AnyAlgorithmStep } from '../../types/graph';
import { Activity, ArrowRightLeft, Target, Award, ListFilter, Compass } from 'lucide-react';
import './StepExplanationPanel.css';

interface StepExplanationPanelProps {
  step?: AnyAlgorithmStep;
  currentStepIdx: number;
  totalSteps: number;
  selectedAlgoId?: string;
  algoName?: string;
}

interface MacroStrategy {
  badge: string;
  strategy: string;
}

const getMacroStrategy = (
  step: AnyAlgorithmStep,
  selectedAlgoId?: string,
  algoName?: string
): MacroStrategy => {
  const algo = selectedAlgoId || 'bubble-sort';

  if (algo === 'bfs' || step.meta?.kind === 'bfs') {
    return {
      badge: 'BFS · Genişlik Öncelikli Arama',
      strategy: 'Kuyruk (Queue) kullanılarak düğümler katman katman genişleyerek taranıyor.',
    };
  }

  if (algo === 'dfs' || step.meta?.kind === 'dfs') {
    return {
      badge: 'DFS · Derinlik Öncelikli Arama',
      strategy: 'Yığın (Stack) kullanılarak gidilebilen en derin düğüme kadar ilerleniyor.',
    };
  }

  const arrayStep = step as AlgorithmStep;
  const pass = arrayStep.stats?.pass || 1;

  switch (algo) {
    case 'bubble-sort': {
      if (step.type === 'PASS_COMPLETE') {
        return {
          badge: `Baloncuk Sıralaması · Tur ${pass} Tamamlandı`,
          strategy: `Tur ${pass} sona erdi. Bu turun en büyük elemanı dizinin sağındaki doğru yerine kilitlendi.`,
        };
      }
      return {
        badge: `Baloncuk Sıralaması · Tur ${pass}`,
        strategy: `Komşu elemanlar karşılaştırılıyor. Amacımız her turda dizideki en büyük elemanı sağa doğru baloncuk gibi kaydırmaktır.`,
      };
    }
    case 'selection-sort': {
      if (step.type === 'SELECT_MIN') {
        return {
          badge: `Seçmeli Sıralama · Tur ${pass}`,
          strategy: `Dizinin henüz sıralanmamış bölümünde en küçük (minimum) eleman aranıyor.`,
        };
      }
      return {
        badge: `Seçmeli Sıralama · Tur ${pass}`,
        strategy: `Bulunan minimum eleman sıralı bölümün sonuna yerleştiriliyor. Sol taraf giderek sıralı hale gelir.`,
      };
    }
    case 'insertion-sort': {
      return {
        badge: `Ekleme Sıralaması · Tur ${pass}`,
        strategy: `Seçilen anahtar eleman, sol taraftaki sıralı alt dizinin arasına uygun boşluğa sokuluyor (iskambil destesi yöntemi).`,
      };
    }
    case 'quick-sort': {
      if (step.type === 'PIVOT_SELECT') {
        return {
          badge: `Hızlı Sıralama · Partition Aşaması`,
          strategy: `Pivot eleman seçildi. Hedef: Pivot'tan küçükleri sola, büyükleri sağa ayırmaktır (Divide & Conquer).`,
        };
      }
      return {
        badge: `Hızlı Sıralama · Partition Aşaması`,
        strategy: `Pivot eleman etrafında alt dizi iki parçaya bölünüyor ve özyinelemeli olarak sıralanıyor.`,
      };
    }
    case 'merge-sort': {
      if (step.type === 'SPLIT') {
        return {
          badge: `Birleştirmeli Sıralama · Bölme (Divide) Aşaması`,
          strategy: `Dizi tek eleman kalana kadar ortadan ikiye alt dizilere bölünüyor.`,
        };
      }
      return {
        badge: `Birleştirmeli Sıralama · Birleştirme (Conquer) Aşaması`,
        strategy: `İki sıralı alt dizi karşılaştırılarak tek bir sıralı dizi halinde birleştiriliyor.`,
      };
    }
    case 'linear-search': {
      return {
        badge: `Doğrusal Arama (Linear Search)`,
        strategy: `Dizinin ilk elemanından başlanarak hedef sayı sırayla tek tek aranıyor.`,
      };
    }
    case 'binary-search': {
      return {
        badge: `İkili Arama (Binary Search)`,
        strategy: `Binary Search, sıralı dizinin ortasındaki elemanı hedef değerle karşılaştırır. Hedef ortadaki değerden küçükse sağ taraf, büyükse sol taraf elenir. Böylece arama alanı her adımda yarıya küçülür.`,
      };
    }
    case 'jump-search': {
      return {
        badge: `Atlamalı Arama (Jump Search)`,
        strategy: `Jump Search, sıralı dizide sabit adımlarla (blok boyutunda) ileri sıçrayarak hedefin yer alabileceği bloğu tespit eder; ardından ilgili blok içerisinde doğrusal tarama yapar.`,
      };
    }
    case 'exponential-search': {
      return {
        badge: `Üstel Arama (Exponential Search)`,
        strategy: `Exponential Search, önce hedefin bulunabileceği aralığı indeksleri iki katına çıkararak (1 → 2 → 4 → 8...) belirler. Ardından belirlenen aralık içerisinde ikili arama (Binary Search) kullanarak hedefi bulur.`,
      };
    }
    case 'interpolation-search': {
      return {
        badge: `İnterpolasyon Araması (Interpolation Search)`,
        strategy: `Interpolation Search, sıralı dizide hedef değerin yaklaşık konumunu tahmin ederek arama yapar. Binary Search her seferinde ortadaki konumu (mid) seçerken, Interpolation Search hedefin değerine göre dizide nerede olması gerektiğini hesaplayarak tahmin edilen konuma (P) doğrudan sıçrar.`,
      };
    }
    default: {
      return {
        badge: `${algoName || 'Algoritma'} · Tur ${pass}`,
        strategy: `Algoritma adım adım yürütülüyor. Stratejik hedef: diziyi küçükten büyüğe sıralamaktır.`,
      };
    }
  }
};

export const StepExplanationPanel: React.FC<StepExplanationPanelProps> = ({
  step,
  currentStepIdx,
  totalSteps,
  selectedAlgoId,
  algoName,
}) => {
  if (!step) {
    return (
      <div className="step-panel glass-panel empty">
        <p>Henüz bir simülasyon adımı bulunmuyor.</p>
      </div>
    );
  }

  const progressPercent = Math.round(((currentStepIdx + 1) / totalSteps) * 100);

  const getEventTypeLabel = (type: string) => {
    switch (type) {
      case 'COMPARE': return 'KARŞILAŞTIRMA';
      case 'SWAP': return 'YER DEĞİŞTİRME';
      case 'OVERWRITE': return 'YAZMA';
      case 'MARK_SORTED': return 'SIRALANDI';
      case 'COMPLETE': return 'TAMAMLANDI';
      case 'PIVOT_SELECT': return 'PİVOT SEÇİMİ';
      case 'SPLIT': return 'BÖLME';
      case 'MERGE': return 'BİRLEŞTİRME';
      case 'SELECT_MIN': return 'MİNİMUM SEÇİMİ';
      case 'INSERT': return 'EKLEME';
      case 'ENQUEUE_NODE': return 'KUYRUĞA EKLEME';
      case 'VISIT_NODE': return 'ZİYARET';
      case 'TRAVERSE_EDGE': return 'KENAR GEÇİŞİ';
      case 'PUSH_NODE': return 'YIĞINA EKLEME';
      case 'POP_NODE': return 'YIĞINDAN ÇIKARMA';
      default: return type;
    }
  };

  const getEventTypeBadgeClass = (type: string) => {
    switch (type) {
      case 'COMPARE': return 'badge-amber';
      case 'SWAP': return 'badge-red';
      case 'OVERWRITE': return 'badge-red';
      case 'MARK_SORTED': return 'badge-green';
      case 'COMPLETE': return 'badge-green';
      case 'PIVOT_SELECT': return 'badge-purple';
      case 'SPLIT': return 'badge-blue';
      case 'MERGE': return 'badge-blue';
      default: return 'badge-blue';
    }
  };

  /**
   * Metindeki sayı, indeks ve değerleri görsel olarak vurgulamak için yardımcı fonksiyon.
   * TextContent birleştirmesini bozmaz (düz metin korunan DOM yapısı).
   */
  const renderHighlightedText = (text: string) => {
    const parts = text.split(/(\d+)/g);
    return parts.map((part, i) => {
      if (/^\d+$/.test(part)) {
        return (
          <mark key={i} className="highlight-tag mono">
            {part}
          </mark>
        );
      }
      return part;
    });
  };

  const macroStrategy = getMacroStrategy(step, selectedAlgoId, algoName);

  return (
    <div className="step-panel glass-panel">
      <div className="step-header">
        <div className="step-counter">
          <Activity size={18} className="icon-pulse" />
          <span className="counter-text mono">
            Adım <strong>{step.stepIndex}</strong> / {totalSteps}
          </span>
        </div>
        <span className={`badge ${getEventTypeBadgeClass(step.type)}`}>
          {getEventTypeLabel(step.type)}
        </span>
      </div>

      {/* Step Progress Line */}
      <div className="step-progress-bar">
        <div
          className="step-progress-fill"
          style={{ width: `${progressPercent}%` }}
        ></div>
      </div>

      <div className="step-content">
        <h3 className="step-title">{renderHighlightedText(step.title)}</h3>

        <div className="step-explanation-box">
          <p className="explanation-text">{renderHighlightedText(step.description)}</p>
        </div>

        {/* P1-A: Makro Algoritma Stratejisi Kartı */}
        <div className="macro-strategy-card">
          <div className="macro-header">
            <Compass size={15} className="macro-icon" />
            <span className="macro-badge">{macroStrategy.badge}</span>
          </div>
          <p className="macro-text">{macroStrategy.strategy}</p>
        </div>

        {step.formula && (
          <div className="formula-box mono">
            <span className="formula-label">Matematiksel / Mantıksal İşlem:</span>
            <span className="formula-code">{step.formula}</span>
          </div>
        )}

        {step && 'visitedCount' in step.stats ? (
          <div className="step-stats-grid mono">
            <div className="stat-card">
              <span className="stat-label">
                <ListFilter size={14} /> Gezilen Düğüm
              </span>
              <span className="stat-val">{step.stats.visitedCount}</span>
            </div>

            <div className="stat-card">
              <span className="stat-label">
                <ArrowRightLeft size={14} /> Taranan Kenar
              </span>
              <span className="stat-val">{step.stats.traversedEdgesCount}</span>
            </div>

            <div className="stat-card">
              <span className="stat-label">
                <Target size={14} /> Max Kuyruk Boyutu
              </span>
              <span className="stat-val">{step.stats.maxFrontierSize}</span>
            </div>
          </div>
        ) : step ? (
          <div className="step-stats-grid mono">
            <div className="stat-card">
              <span className="stat-label">
                <ListFilter size={14} /> Tur (Pass)
              </span>
              <span className="stat-val">{(step as AlgorithmStep).stats.pass}</span>
            </div>

            <div className="stat-card">
              <span className="stat-label">
                <ArrowRightLeft size={14} /> Karşılaştırma
              </span>
              <span className="stat-val">{(step as AlgorithmStep).stats.comparisons}</span>
            </div>

            <div className="stat-card">
              <span className="stat-label">
                <Target size={14} /> Yer Değiştirme
              </span>
              <span className="stat-val">{(step as AlgorithmStep).stats.swaps}</span>
            </div>

            {(step as AlgorithmStep).pivotIndex !== undefined &&
              Array.isArray((step as AlgorithmStep).arraySnapshot) && (
                <div className="stat-card highlight-purple">
                  <span className="stat-label">
                    <Award size={14} /> Aktif Pivot
                  </span>
                  <span className="stat-val">
                    İndeks {(step as AlgorithmStep).pivotIndex} (
                    {(step as AlgorithmStep).arraySnapshot?.[(step as AlgorithmStep).pivotIndex!]}
                    )
                  </span>
                </div>
              )}
          </div>
        ) : null}
      </div>
    </div>
  );
};
