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

  const getCategoryIcon = (categoryId: string) => {
    switch (categoryId) {
      case 'linear':
        return <Layers size={16} />;
      case 'tree':
        return <GitFork size={16} />;
      case 'sorting':
        return <ArrowDownUp size={16} />;
      case 'searching':
        return <Search size={16} />;
      default:
        return <Layers size={16} />;
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

      {/* Category Pills & Selector */}
      <div className="nav-category-pills">
        {CATEGORY_GROUPS.map((group) => {
          const isCategoryActive = group.itemIds.includes(selectedItemId);

          return (
            <div key={group.id} className="category-group-wrapper">
              <div
                className={`category-pill ${isCategoryActive ? 'active' : ''}`}
                onClick={() => {
                  if (!isCategoryActive) {
                    onSelectItem(group.itemIds[0]);
                  }
                }}
              >
                <span className="category-icon">{getCategoryIcon(group.id)}</span>
                <span className="category-name">{group.name}</span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Current Item Dropdown & Controls */}
      <div className="nav-action-group">
        <div className="item-select-wrapper">
          <select
            value={selectedItemId}
            onChange={(e) => onSelectItem(e.target.value)}
            className="item-select-dropdown"
          >
            {CATEGORY_GROUPS.map((group) => (
              <optgroup key={group.id} label={group.name}>
                {group.itemIds.map((itemId) => {
                  const item = ALL_VISUALIZER_ITEMS[itemId];
                  return (
                    <option key={itemId} value={itemId}>
                      {item.name}
                    </option>
                  );
                })}
              </optgroup>
            ))}
          </select>
        </div>

        {/* Toggle Code & Metrics Drawer */}
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
