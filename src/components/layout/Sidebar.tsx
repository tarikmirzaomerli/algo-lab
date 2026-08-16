import React, { useState, useEffect, useRef } from 'react';
import { ALL_ALGORITHMS } from '../../core/algorithms';
import {
  ArrowUpDown,
  Search,
  Network,
  Database,
  ChevronRight,
  CheckCircle2,
  Lock,
} from 'lucide-react';
import './Sidebar.css';

interface SidebarProps {
  selectedAlgoId: string;
  onSelectAlgorithm: (id: string) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  selectedAlgoId,
  onSelectAlgorithm,
}) => {
  const selectedAlgo = ALL_ALGORITHMS.find(
    (algo) => algo.metadata.id === selectedAlgoId
  );
  const activeCategoryForSelectedAlgo = selectedAlgo?.metadata.category ?? 'sorting';

  const selectedItemRef = useRef<HTMLButtonElement | null>(null);

  const [expandedCategories, setExpandedCategories] = useState<Record<string, boolean>>({
    sorting: true,
    searching: true,
    graph: true,
    [activeCategoryForSelectedAlgo]: true,
  });

  useEffect(() => {
    if (activeCategoryForSelectedAlgo) {
      setExpandedCategories((prev) => ({
        ...prev,
        [activeCategoryForSelectedAlgo]: true,
      }));
    }
  }, [activeCategoryForSelectedAlgo]);

  useEffect(() => {
    if (selectedItemRef.current) {
      selectedItemRef.current.scrollIntoView({
        block: 'nearest',
        behavior: 'smooth',
      });
    }
  }, [selectedAlgoId]);

  const toggleCategory = (catId: string) => {
    setExpandedCategories((prev) => ({
      ...prev,
      [catId]: !prev[catId],
    }));
  };

  const categories = [
    {
      id: 'sorting',
      title: 'Sorting (Sıralama)',
      icon: <ArrowUpDown size={18} />,
      active: true,
      algorithms: ALL_ALGORITHMS.filter((algo) => algo.metadata.category === 'sorting'),
    },
    {
      id: 'searching',
      title: 'Searching (Arama)',
      icon: <Search size={18} />,
      active: true,
      algorithms: ALL_ALGORITHMS.filter((algo) => algo.metadata.category === 'searching'),
    },
    {
      id: 'graph',
      title: 'Graph (Çizge)',
      icon: <Network size={18} />,
      active: true,
      algorithms: ALL_ALGORITHMS.filter((algo) => algo.metadata.category === 'graph'),
      comingSoon: 'Dijkstra, A* (Yakında)',
    },
    {
      id: 'data-structures',
      title: 'Veri Yapıları',
      icon: <Database size={18} />,
      active: false,
      comingSoon: 'Stack, Queue, Tree, Heap',
    },
  ];

  return (
    <aside className="app-sidebar" aria-label="Algoritma Kategorileri Ve Listesi">
      <div className="sidebar-section-title">KATEGORİLER</div>

      <nav className="sidebar-nav" aria-label="Kategoriler">
        {categories.map((cat) => {
          const isExpanded = !!expandedCategories[cat.id];

          return (
            <div key={cat.id} className="nav-group">
              {cat.active ? (
                <button
                  type="button"
                  className={`group-header active ${isExpanded ? 'is-expanded' : ''}`}
                  onClick={() => toggleCategory(cat.id)}
                  aria-expanded={isExpanded}
                  aria-controls={`submenu-${cat.id}`}
                  aria-label={`${cat.title} kategorisini ${isExpanded ? 'kapat' : 'aç'}`}
                >
                  <div className="group-title-content">
                    {cat.icon}
                    <span>{cat.title}</span>
                  </div>
                  <ChevronRight
                    size={16}
                    className={`chevron-icon ${isExpanded ? 'expanded' : ''}`}
                  />
                </button>
              ) : (
                <button
                  type="button"
                  className="group-header disabled"
                  disabled
                  aria-disabled="true"
                  aria-expanded={false}
                  aria-label={`${cat.title} (Yakında)`}
                >
                  <div className="group-title-content">
                    {cat.icon}
                    <span>{cat.title}</span>
                  </div>
                  <span className="badge-soon">YAKINDA</span>
                </button>
              )}

              {cat.active && isExpanded && (
                <div
                  id={`submenu-${cat.id}`}
                  className="sub-menu"
                  role="menu"
                  aria-label={`${cat.title} Algoritmaları`}
                >
                  {cat.algorithms?.map((algo) => {
                    const isSelected = algo.metadata.id === selectedAlgoId;
                    const complexityLabel =
                      algo.metadata.id === 'quick-sort'
                        ? 'O(n log n) avg.'
                        : algo.metadata.complexity.time.average;

                    return (
                      <button
                        key={algo.metadata.id}
                        ref={isSelected ? selectedItemRef : null}
                        type="button"
                        className={`sub-menu-item ${isSelected ? 'selected' : ''}`}
                        onClick={() => onSelectAlgorithm(algo.metadata.id)}
                        aria-label={`Algoritma seç: ${algo.metadata.name}`}
                        aria-current={isSelected ? 'page' : undefined}
                      >
                        <div className="item-left">
                          <span className="bullet"></span>
                          <span className="algo-name">{algo.metadata.name}</span>
                        </div>
                        <div className="item-right">
                          <span
                            className="complexity-badge mono"
                            title={`Zaman Karmaşıklığı: ${complexityLabel}`}
                          >
                            {complexityLabel}
                          </span>
                          {isSelected && (
                            <CheckCircle2 size={16} className="active-check" />
                          )}
                        </div>
                      </button>
                    );
                  })}
                </div>
              )}

              {!cat.active && (
                <div className="disabled-hint">
                  <Lock size={12} />
                  <span>{cat.comingSoon}</span>
                </div>
              )}
            </div>
          );
        })}
      </nav>
    </aside>
  );
};
