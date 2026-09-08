import { describe, it, expect } from 'vitest';
import { generateJumpSearchSnapshots } from '../../algorithms/searching/jumpSearch';
import { generateInterpolationSearchSnapshots } from '../../algorithms/searching/interpolationSearch';
import { generateExponentialSearchSnapshots } from '../../algorithms/searching/exponentialSearch';

describe('Advanced Searching Snapshot Generators (Jump, Interpolation, Exponential)', () => {
  const sortedArray = [12, 24, 36, 48, 60, 72, 84, 96, 108, 120];

  describe('Jump Search', () => {
    it('should find existing element in sorted array using jump blocks', () => {
      const snapshots = generateJumpSearchSnapshots(sortedArray, 72);
      expect(snapshots.length).toBeGreaterThan(0);
      const foundSnap = snapshots.find((s) => s.operationType === 'found');
      expect(foundSnap).toBeDefined();
      expect(foundSnap?.statusNote).toContain('bulundu');
    });

    it('should handle element not in array', () => {
      const snapshots = generateJumpSearchSnapshots(sortedArray, 999);
      const lastSnap = snapshots[snapshots.length - 1];
      expect(lastSnap.operationType).toBe('not-found');
    });
  });

  describe('Interpolation Search', () => {
    it('should calculate target position and find element', () => {
      const snapshots = generateInterpolationSearchSnapshots(sortedArray, 60);
      expect(snapshots.length).toBeGreaterThan(0);
      const foundSnap = snapshots.find((s) => s.operationType === 'found');
      expect(foundSnap).toBeDefined();
      expect(foundSnap?.pointers?.pos).toBe(4);
    });

    it('should handle missing element gracefully', () => {
      const snapshots = generateInterpolationSearchSnapshots(sortedArray, 55);
      const lastSnap = snapshots[snapshots.length - 1];
      expect(lastSnap.operationType).toBe('not-found');
    });
  });

  describe('Exponential Search', () => {
    it('should find range and locate element using binary search', () => {
      const snapshots = generateExponentialSearchSnapshots(sortedArray, 84);
      expect(snapshots.length).toBeGreaterThan(0);
      const foundSnap = snapshots.find((s) => s.operationType === 'found');
      expect(foundSnap).toBeDefined();
      expect(foundSnap?.statusNote).toContain('bulundu');
    });

    it('should find element if it is at 0th index', () => {
      const snapshots = generateExponentialSearchSnapshots(sortedArray, 12);
      expect(snapshots.length).toBe(1);
      expect(snapshots[0].operationType).toBe('found');
    });
  });
});
