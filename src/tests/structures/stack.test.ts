import { describe, it, expect } from 'vitest';
import {
  createInitialStack,
  generateStackPushSnapshots,
  generateStackPopSnapshots,
  generateStackPeekSnapshots,
  MAX_STACK_CAPACITY,
} from '../../structures/stack/stackEngine';

describe('Stack Engine (LIFO)', () => {
  it('should initialize stack correctly', () => {
    const stack = createInitialStack([10, 20, 30]);
    expect(stack.items.length).toBe(3);
    expect(stack.items[2].value).toBe(30);
  });

  it('should generate push snapshots and update top element', () => {
    const stack = createInitialStack([10, 20]);
    const snapshots = generateStackPushSnapshots(stack, 99);

    expect(snapshots.length).toBeGreaterThanOrEqual(3);
    const finalSnapshot = snapshots[snapshots.length - 1];
    expect(finalSnapshot.structureState.items.length).toBe(3);
    expect(finalSnapshot.structureState.items[2].value).toBe(99);
    expect(finalSnapshot.pointers?.top).toBe(2);
  });

  it('should prevent push when capacity is exceeded (overflow check)', () => {
    const fullItems = Array.from({ length: MAX_STACK_CAPACITY }, (_, i) => (i + 1) * 10);
    const stack = createInitialStack(fullItems);
    const snapshots = generateStackPushSnapshots(stack, 100);

    expect(snapshots.length).toBe(1);
    expect(snapshots[0].statusNote).toContain('Taşma (Overflow)');
    expect(snapshots[0].structureState.items.length).toBe(MAX_STACK_CAPACITY);
  });

  it('should generate pop snapshots removing top element', () => {
    const stack = createInitialStack([10, 20, 30]);
    const snapshots = generateStackPopSnapshots(stack);

    expect(snapshots.length).toBeGreaterThanOrEqual(3);
    const finalSnapshot = snapshots[snapshots.length - 1];
    expect(finalSnapshot.structureState.items.length).toBe(2);
    expect(finalSnapshot.structureState.items[1].value).toBe(20);
    expect(finalSnapshot.pointers?.top).toBe(1);
  });

  it('should handle pop on empty stack (underflow check)', () => {
    const stack = createInitialStack([]);
    const snapshots = generateStackPopSnapshots(stack);

    expect(snapshots.length).toBe(1);
    expect(snapshots[0].statusNote).toContain('Underflow');
  });

  it('should generate peek snapshot without modifying stack', () => {
    const stack = createInitialStack([10, 50]);
    const snapshots = generateStackPeekSnapshots(stack);

    expect(snapshots.length).toBe(1);
    expect(snapshots[0].structureState.items.length).toBe(2);
    expect(snapshots[0].statusNote).toContain('50');
  });
});
