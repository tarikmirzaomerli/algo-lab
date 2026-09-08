import React from 'react';
import { CATEGORY_GROUPS, ALL_VISUALIZER_ITEMS } from '../../algorithms/registry';
import { Code2, Layers, GitFork, ArrowDownUp, Search } from 'lucide-react';
import './TopNavBar.css';

interface TopNavBarProps {
  selectedItemId: string;
  onSelectItem: (id: string) => void;
  isDrawerOpen: boolean;
  onToggleDrawer: () => void;
}

export const TopNavBar: React.FC<TopNavBarProps> = ({
  selectedItemId,
  onSelectItem,
  isDrawerOpen,
  onToggleDrawer,
}) => {
  const currentCategory =
    CATEGORY_GROUPS.find((group) => group.itemIds.includes(selectedItemId)) || CATEGORY_GROUPS[2];

  const getCategoryIcon = (categoryId: string) => {
    switch (categoryId) {
      case 'linear':
        return <Layers size={15} />;
      case 'tree':
        return <GitFork size={15} />;
      case 'sorting':
        return <ArrowDownUp size={15} />;
      case 'searching':
        return <Search size={15} />;
      default:
        return <Layers size={15} />;
    }
  };

  return (
    <header className="top-nav-bar">
      {/* Brand Logo */}
      <div className="nav-brand-group">
        <div className="brand-logo-pill">
          <div className="logo-icon-dot" />
          <span className="logo-text">AlgoLab</span>
          <span className="logo-version-tag">2.0</span>
        </div>
      </div>

      {/* Simplified Category Tabs */}
      <nav className="nav-category-pills" aria-label="Ana Kategoriler">
        {CATEGORY_GROUPS.map((group) => {
          const isCategoryActive = group.id === currentCategory.id;

          return (
            <button
              key={group.id}
              className={`category-pill ${isCategoryActive ? 'active' : ''}`}
              onClick={() => {
                if (!isCategoryActive) {
                  onSelectItem(group.itemIds[0]);
                }
              }}
            >
              <span className="category-icon">{getCategoryIcon(group.id)}</span>
              <span className="category-name">{group.name}</span>
            </button>
          );
        })}
      </nav>

      {/* Active Sub-item Pills inside category */}
      <div className="nav-item-pills-row">
        {currentCategory.itemIds.map((itemId) => {
          const item = ALL_VISUALIZER_ITEMS[itemId];
          const isItemActive = itemId === selectedItemId;

          return (
            <button
              key={itemId}
              onClick={() => onSelectItem(itemId)}
              className={`item-pill ${isItemActive ? 'active' : ''}`}
            >
              <span>{item.shortName}</span>
            </button>
          );
        })}
      </div>

      {/* Code Drawer Toggle */}
      <div className="nav-right-actions">
        <button
          onClick={onToggleDrawer}
          className={`drawer-toggle-btn ${isDrawerOpen ? 'active' : ''}`}
          title="Sözde Kod ve Canlı Metrikleri Göster/Gizle"
        >
          <Code2 size={16} />
          <span>Sözde Kod</span>
        </button>
      </div>
    </header>
  );
};
