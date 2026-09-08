import { describe, it, expect } from 'vitest';
import {
  createInitialBST,
  generateBSTInsertSnapshots,
  generateBSTSearchSnapshots,
  generateBSTTraversalSnapshots,
} from '../../structures/bst/bstEngine';

describe('Binary Search Tree Engine (BST)', () => {
  it('should initialize BST following BST property', () => {
    const bst = createInitialBST([50, 30, 70]);
    expect(bst.rootId).toBe('bst-node-50');
    expect(bst.nodes['bst-node-50'].leftId).toBe('bst-node-30');
    expect(bst.nodes['bst-node-50'].rightId).toBe('bst-node-70');
  });

  it('should insert value by walking down left/right comparison paths', () => {
    const bst = createInitialBST([50, 30, 70]);
    const snapshots = generateBSTInsertSnapshots(bst, 20);

    const lastSnap = snapshots[snapshots.length - 1];
    expect(lastSnap.structureState.nodes['bst-node-30'].leftId).toBe('bst-node-20');
    expect(lastSnap.operationType).toBe('settled');
  });

  it('should search existing node in BST', () => {
    const bst = createInitialBST([50, 30, 70, 20, 40]);
    const snapshots = generateBSTSearchSnapshots(bst, 40);

    const foundSnap = snapshots[snapshots.length - 1];
    expect(foundSnap.operationType).toBe('found');
    expect(foundSnap.statusNote).toContain('bulundu');
  });

  it('should handle search for non-existing node', () => {
    const bst = createInitialBST([50, 30, 70]);
    const snapshots = generateBSTSearchSnapshots(bst, 999);

    const lastSnap = snapshots[snapshots.length - 1];
    expect(lastSnap.operationType).toBe('not-found');
    expect(lastSnap.statusNote).toContain('bulunamadı');
  });

  it('should perform In-Order traversal yielding sorted output', () => {
    const bst = createInitialBST([50, 30, 70, 20, 40, 60, 80]);
    const snapshots = generateBSTTraversalSnapshots(bst, 'inorder');

    expect(snapshots.length).toBe(7);
    const lastSnap = snapshots[snapshots.length - 1];
    expect(lastSnap.structureState.visitedSequence).toEqual([20, 30, 40, 50, 60, 70, 80]);
  });
});
