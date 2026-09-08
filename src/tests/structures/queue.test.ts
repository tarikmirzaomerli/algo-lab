import { describe, it, expect } from 'vitest';
import {
  createInitialQueue,
  generateQueueEnqueueSnapshots,
  generateQueueDequeueSnapshots,
  generateQueuePeekSnapshots,
  MAX_QUEUE_CAPACITY,
} from '../../structures/queue/queueEngine';

describe('Queue Engine (FIFO)', () => {
  it('should initialize queue correctly', () => {
    const queue = createInitialQueue([5, 10, 15]);
    expect(queue.items.length).toBe(3);
    expect(queue.items[0].value).toBe(5);
  });

  it('should enqueue item at rear', () => {
    const queue = createInitialQueue([5, 10]);
    const snapshots = generateQueueEnqueueSnapshots(queue, 88);

    expect(snapshots.length).toBeGreaterThanOrEqual(3);
    const lastSnap = snapshots[snapshots.length - 1];
    expect(lastSnap.structureState.items.length).toBe(3);
    expect(lastSnap.structureState.items[2].value).toBe(88);
    expect(lastSnap.pointers?.rear).toBe(2);
    expect(lastSnap.pointers?.front).toBe(0);
  });

  it('should prevent enqueue on full queue', () => {
    const fullItems = Array.from({ length: MAX_QUEUE_CAPACITY }, (_, i) => i * 10);
    const queue = createInitialQueue(fullItems);
    const snapshots = generateQueueEnqueueSnapshots(queue, 999);

    expect(snapshots.length).toBe(1);
    expect(snapshots[0].statusNote).toContain('Taşma (Overflow)');
  });

  it('should dequeue front item adhering to FIFO', () => {
    const queue = createInitialQueue([100, 200, 300]);
    const snapshots = generateQueueDequeueSnapshots(queue);

    expect(snapshots.length).toBeGreaterThanOrEqual(3);
    const lastSnap = snapshots[snapshots.length - 1];
    expect(lastSnap.structureState.items.length).toBe(2);
    expect(lastSnap.structureState.items[0].value).toBe(200); // 100 was dequeued
  });

  it('should handle dequeue on empty queue (underflow)', () => {
    const queue = createInitialQueue([]);
    const snapshots = generateQueueDequeueSnapshots(queue);

    expect(snapshots.length).toBe(1);
    expect(snapshots[0].statusNote).toContain('Underflow');
  });

  it('should peek front item without mutating queue', () => {
    const queue = createInitialQueue([77, 88]);
    const snapshots = generateQueuePeekSnapshots(queue);

    expect(snapshots.length).toBe(1);
    expect(snapshots[0].statusNote).toContain('77');
  });
});
