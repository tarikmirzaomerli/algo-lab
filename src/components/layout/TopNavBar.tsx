import React from 'react';
import { CATEGORY_GROUPS, ALL_VISUALIZER_ITEMS } from '../../algorithms/registry';
import { Code2, Layers, GitFork, ArrowDownUp, Search, Sun, Moon, Globe } from 'lucide-react';
import type { Language, Translations } from '../../i18n/translations';
import './TopNavBar.css';

interface TopNavBarProps {
  selectedItemId: string;
  onSelectItem: (id: string) => void;
  isDrawerOpen: boolean;
  onToggleDrawer: () => void;
  lang: Language;
  onToggleLang: () => void;
  theme: 'light' | 'dark';
  onToggleTheme: () => void;
  t: Translations;
}

export const TopNavBar: React.FC<TopNavBarProps> = ({
  selectedItemId,
  onSelectItem,
  isDrawerOpen,
  onToggleDrawer,
  lang,
  onToggleLang,
  theme,
  onToggleTheme,
  t,
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

  const getItemLabel = (itemId: string): string => {
    if (itemId === 'stack') return t.stack.shortName;
    if (itemId === 'queue') return t.queue.shortName;
    if (itemId === 'linked-list') return t.linkedList.shortName;
    if (itemId === 'bst') return t.bst.shortName;
    if (t.algoNames[itemId]) return t.algoNames[itemId].shortName;
    return ALL_VISUALIZER_ITEMS[itemId]?.shortName || itemId;
  };

  const getCategoryLabel = (catId: string): string => {
    if (catId === 'linear') return t.categories.linear;
    if (catId === 'tree') return t.categories.tree;
    if (catId === 'sorting') return t.categories.sorting;
    if (catId === 'searching') return t.categories.searching;
    return catId;
  };

  return (
    <header className="top-nav-bar">
      {/* 1. Brand Logo */}
      <div className="nav-brand-group">
        <div className="brand-logo-pill">
          <div className="logo-icon-dot" />
          <span className="logo-text">{t.brandName}</span>
          <span className="logo-version-tag">{t.brandTag}</span>
        </div>
      </div>

      {/* 2. Middle Nav Section: Categories & Sub-items */}
      <div className="nav-middle-section">
        {/* Category Tabs */}
        <nav className="nav-category-pills" aria-label="Categories">
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
                <span className="category-name">{getCategoryLabel(group.id)}</span>
              </button>
            );
          })}
        </nav>

        {/* Active Sub-item Pills inside category (Responsive & Scroll-safe) */}
        <div className="nav-item-pills-row" role="tablist">
          {currentCategory.itemIds.map((itemId) => {
            const isItemActive = itemId === selectedItemId;

            return (
              <button
                key={itemId}
                onClick={() => onSelectItem(itemId)}
                className={`item-pill ${isItemActive ? 'active' : ''}`}
                role="tab"
                aria-selected={isItemActive}
              >
                <span>{getItemLabel(itemId)}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* 3. Right Action Controls: Lang, Dark Mode, Pseudocode Drawer */}
      <div className="nav-right-actions">
        {/* Language Switch Button */}
        <button
          onClick={onToggleLang}
          className="nav-action-pill lang-toggle-btn"
          title={lang === 'tr' ? 'Switch to English' : "Türkçe'ye Geç"}
          aria-label="Toggle language"
        >
          <Globe size={15} className="lang-icon" />
          <span className="lang-code">{lang.toUpperCase()}</span>
        </button>

        {/* Dark Mode Toggle Button */}
        <button
          onClick={onToggleTheme}
          className="nav-action-pill theme-toggle-btn"
          title={theme === 'dark' ? (lang === 'tr' ? 'Açık Mod' : 'Light Mode') : (lang === 'tr' ? 'Karanlık Mod' : 'Dark Mode')}
          aria-label="Toggle dark/light mode"
        >
          {theme === 'dark' ? (
            <Sun size={15} className="theme-sun-icon" />
          ) : (
            <Moon size={15} className="theme-moon-icon" />
          )}
        </button>

        {/* Code Drawer Toggle */}
        <button
          onClick={onToggleDrawer}
          className={`drawer-toggle-btn ${isDrawerOpen ? 'active' : ''}`}
          title={t.pseudocode}
        >
          <Code2 size={16} />
          <span className="drawer-btn-label">{t.pseudocode}</span>
        </button>
      </div>
    </header>
  );
};
