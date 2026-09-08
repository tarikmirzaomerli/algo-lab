import { describe, it, expect } from 'vitest';
import {
  createInitialLinkedList,
  getOrderedNodes,
  generateInsertHeadSnapshots,
  generateInsertTailSnapshots,
  generateDeleteNodeSnapshots,
  generateSearchSnapshots,
} from '../../structures/linkedList/linkedListEngine';

describe('Singly Linked List Engine', () => {
  it('should initialize linked list with nodes chained', () => {
    const list = createInitialLinkedList([10, 20, 30]);
    const ordered = getOrderedNodes(list);

    expect(ordered.length).toBe(3);
    expect(ordered[0].value).toBe(10);
    expect(ordered[1].value).toBe(20);
    expect(ordered[2].value).toBe(30);
  });

  it('should insert new node at head in O(1)', () => {
    const list = createInitialLinkedList([20, 30]);
    const snapshots = generateInsertHeadSnapshots(list, 10);

    const lastSnap = snapshots[snapshots.length - 1];
    const ordered = getOrderedNodes(lastSnap.structureState);

    expect(ordered.length).toBe(3);
    expect(ordered[0].value).toBe(10);
    expect(ordered[1].value).toBe(20);
    expect(ordered[2].value).toBe(30);
  });

  it('should insert new node at tail in O(n)', () => {
    const list = createInitialLinkedList([10, 20]);
    const snapshots = generateInsertTailSnapshots(list, 30);

    const lastSnap = snapshots[snapshots.length - 1];
    const ordered = getOrderedNodes(lastSnap.structureState);

    expect(ordered.length).toBe(3);
    expect(ordered[0].value).toBe(10);
    expect(ordered[1].value).toBe(20);
    expect(ordered[2].value).toBe(30);
  });

  it('should delete node by value and reconnect pointers', () => {
    const list = createInitialLinkedList([10, 20, 30]);
    const snapshots = generateDeleteNodeSnapshots(list, 20);

    const lastSnap = snapshots[snapshots.length - 1];
    const ordered = getOrderedNodes(lastSnap.structureState);

    expect(ordered.length).toBe(2);
    expect(ordered[0].value).toBe(10);
    expect(ordered[1].value).toBe(30);
  });

  it('should search node by value step by step', () => {
    const list = createInitialLinkedList([10, 20, 30, 40]);
    const snapshots = generateSearchSnapshots(list, 30);

    expect(snapshots.length).toBe(3); // nodes 10, 20, 30
    const foundSnap = snapshots[snapshots.length - 1];
    expect(foundSnap.operationType).toBe('found');
    expect(foundSnap.statusNote).toContain('bulundu');
  });
});
