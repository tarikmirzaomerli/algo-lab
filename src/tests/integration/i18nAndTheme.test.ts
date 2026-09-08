import { describe, it, expect } from 'vitest';
import { TRANSLATIONS } from '../../i18n/translations';
import { ALL_VISUALIZER_ITEMS } from '../../algorithms/registry';

describe('i18n & Theme Verification', () => {
  it('should have complete translations for both TR and EN', () => {
    const tr = TRANSLATIONS.tr;
    const en = TRANSLATIONS.en;

    expect(tr.brandName).toBe('AlgoLab');
    expect(en.brandName).toBe('AlgoLab');

    expect(tr.categories.linear).toBeDefined();
    expect(en.categories.linear).toBeDefined();
    expect(tr.categories.searching).toBeDefined();
    expect(en.categories.searching).toBeDefined();

    // Verify all visualizer items have localized names
    const itemIds = Object.keys(ALL_VISUALIZER_ITEMS);
    for (const id of itemIds) {
      if (['stack', 'queue', 'linked-list', 'bst'].includes(id)) {
        continue;
      }
      expect(tr.algoNames[id]).toBeDefined();
      expect(en.algoNames[id]).toBeDefined();
      expect(tr.algoNames[id].shortName.length).toBeGreaterThan(0);
      expect(en.algoNames[id].shortName.length).toBeGreaterThan(0);
    }
  });

  it('should contain Exponential Search in both languages with descriptive metadata', () => {
    expect(TRANSLATIONS.tr.algoNames['exponential-search'].name).toContain('Exponential Search');
    expect(TRANSLATIONS.en.algoNames['exponential-search'].name).toBe('Exponential Search');
  });
});
