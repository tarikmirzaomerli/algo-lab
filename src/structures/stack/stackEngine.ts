import type { StepSnapshot, VisualizerItemMetadata } from '../../engine/types';

export interface StackItem {
  id: string;
  value: number;
}

export type StackState = {
  items: StackItem[];
  capacity: number;
  lastAction?: 'push' | 'pop' | 'peek' | 'clear' | 'init';
  highlightedId?: string;
};

export const STACK_METADATA: VisualizerItemMetadata = {
  id: 'stack',
  name: 'Stack (Yığın)',
  shortName: 'Stack',
  category: 'linear',
  kind: 'structure',
  description:
    'Son giren ilk çıkar (LIFO - Last In First Out) prensibine sahip doğrusal veri yapısı.',
  complexity: {
    time: {
      best: 'O(1)',
      average: 'O(1)',
      worst: 'O(1)',
    },
    space: 'O(n)',
  },
  pseudocode: [
    { line: 1, code: 'function push(value):' },
    { line: 2, code: '  if size == capacity: return OVERFLOW' },
    { line: 3, code: '  top = top + 1' },
    { line: 4, code: '  stack[top] = value' },
    { line: 5, code: 'function pop():' },
    { line: 6, code: '  if top < 0: return UNDERFLOW' },
    { line: 7, code: '  value = stack[top]' },
    { line: 8, code: '  top = top - 1; return value' },
  ],
  properties: {
    principle: 'LIFO (Last In First Out)',
    access: 'Only Top element',
  },
};

export const MAX_STACK_CAPACITY = 7;

export function createInitialStack(values: number[] = [14, 28, 42]): StackState {
  return {
    items: values.map((val, idx) => ({ id: `item-${Date.now()}-${idx}-${val}`, value: val })),
    capacity: MAX_STACK_CAPACITY,
    lastAction: 'init',
  };
}

export function generateStackPushSnapshots(
  currentState: StackState,
  newValue: number
): StepSnapshot<StackState>[] {
  const snapshots: StepSnapshot<StackState>[] = [];
  const currentItems = [...currentState.items];
  const capacity = currentState.capacity || MAX_STACK_CAPACITY;

  // Step 1: Check overflow
  snapshots.push({
    structureState: {
      items: [...currentItems],
      capacity,
      lastAction: 'push',
    },
    activeIndicesOrNodes: [],
    pointers: { top: currentItems.length > 0 ? currentItems.length - 1 : -1 },
    operationType: 'compare',
    codeLine: 2,
    statusNote:
      currentItems.length >= capacity
        ? `Taşma (Overflow): Yığın kapasitesi (${capacity}) dolu, yeni eleman eklenemez!`
        : `Kapasite kontrol ediliyor: ${currentItems.length} / ${capacity} dolu.`,
    metrics: {
      comparisons: 1,
      operations: 0,
      timeComplexity: 'O(1)',
      spaceComplexity: 'O(n)',
      customMetrics: { 'Yığın Boyutu': currentItems.length, Kapasite: capacity },
    },
  });

  if (currentItems.length >= capacity) {
    return snapshots;
  }

  // Step 2: Allocate new item
  const newItem: StackItem = {
    id: `item-${Date.now()}-${newValue}`,
    value: newValue,
  };

  snapshots.push({
    structureState: {
      items: [...currentItems],
      capacity,
      lastAction: 'push',
      highlightedId: newItem.id,
    },
    activeIndicesOrNodes: [newItem.id],
    pointers: { top: currentItems.length - 1, incoming: newValue },
    operationType: 'push',
    codeLine: 3,
    statusNote: `${newValue} değeri yığının tepesine yerleştirilmek üzere hazırlandı.`,
    metrics: {
      comparisons: 1,
      operations: 1,
      timeComplexity: 'O(1)',
      spaceComplexity: 'O(n)',
      customMetrics: { 'Yığın Boyutu': currentItems.length + 1, Kapasite: capacity },
    },
  });

  // Step 3: Push into stack and update top
  const updatedItems = [...currentItems, newItem];
  const newTopIdx = updatedItems.length - 1;

  snapshots.push({
    structureState: {
      items: updatedItems,
      capacity,
      lastAction: 'push',
      highlightedId: newItem.id,
    },
    activeIndicesOrNodes: [newItem.id, newTopIdx],
    pointers: { top: newTopIdx },
    operationType: 'settled',
    codeLine: 4,
    statusNote: `${newValue} yığının en üstüne başarıyla eklendi (top = ${newTopIdx}).`,
    metrics: {
      comparisons: 1,
      operations: 2,
      timeComplexity: 'O(1)',
      spaceComplexity: 'O(n)',
      customMetrics: { 'Yığın Boyutu': updatedItems.length, Kapasite: capacity },
    },
  });

  return snapshots;
}

export function generateStackPopSnapshots(currentState: StackState): StepSnapshot<StackState>[] {
  const snapshots: StepSnapshot<StackState>[] = [];
  const currentItems = [...currentState.items];
  const capacity = currentState.capacity || MAX_STACK_CAPACITY;

  // Step 1: Check underflow
  snapshots.push({
    structureState: {
      items: [...currentItems],
      capacity,
      lastAction: 'pop',
    },
    activeIndicesOrNodes: [],
    pointers: { top: currentItems.length > 0 ? currentItems.length - 1 : -1 },
    operationType: 'compare',
    codeLine: 6,
    statusNote:
      currentItems.length === 0
        ? 'Boş Yığın Hatası (Underflow): Yığında çıkarılacak eleman bulunmuyor!'
        : 'Yığın boş mu kontrol edildi. Eleman mevcut.',
    metrics: {
      comparisons: 1,
      operations: 0,
      timeComplexity: 'O(1)',
      spaceComplexity: 'O(n)',
      customMetrics: { 'Yığın Boyutu': currentItems.length, Kapasite: capacity },
    },
  });

  if (currentItems.length === 0) {
    return snapshots;
  }

  const topIdx = currentItems.length - 1;
  const poppedItem = currentItems[topIdx];

  // Step 2: Highlight top to pop
  snapshots.push({
    structureState: {
      items: [...currentItems],
      capacity,
      lastAction: 'pop',
      highlightedId: poppedItem.id,
    },
    activeIndicesOrNodes: [poppedItem.id, topIdx],
    pointers: { top: topIdx, popping: poppedItem.value },
    operationType: 'pop',
    codeLine: 7,
    statusNote: `En üstteki eleman (${poppedItem.value}) yığından ayrılıyor.`,
    metrics: {
      comparisons: 1,
      operations: 1,
      timeComplexity: 'O(1)',
      spaceComplexity: 'O(n)',
      customMetrics: { 'Yığın Boyutu': currentItems.length, Kapasite: capacity },
    },
  });

  // Step 3: Settle with top item removed
  const remainingItems = currentItems.slice(0, topIdx);
  const newTop = remainingItems.length > 0 ? remainingItems.length - 1 : -1;

  snapshots.push({
    structureState: {
      items: remainingItems,
      capacity,
      lastAction: 'pop',
    },
    activeIndicesOrNodes: newTop >= 0 ? [remainingItems[newTop].id, newTop] : [],
    pointers: { top: newTop },
    operationType: 'settled',
    codeLine: 8,
    statusNote: `${poppedItem.value} başarıyla çıkarıldı. Yeni tepe işaretçisi: ${newTop >= 0 ? `index ${newTop} (${remainingItems[newTop].value})` : 'Boş Yığın'}.`,
    metrics: {
      comparisons: 1,
      operations: 2,
      timeComplexity: 'O(1)',
      spaceComplexity: 'O(n)',
      customMetrics: { 'Yığın Boyutu': remainingItems.length, Kapasite: capacity },
    },
  });

  return snapshots;
}

export function generateStackPeekSnapshots(currentState: StackState): StepSnapshot<StackState>[] {
  const currentItems = [...currentState.items];
  const capacity = currentState.capacity || MAX_STACK_CAPACITY;

  if (currentItems.length === 0) {
    return [
      {
        structureState: { ...currentState, lastAction: 'peek' },
        activeIndicesOrNodes: [],
        pointers: { top: -1 },
        operationType: 'not-found',
        codeLine: 6,
        statusNote: 'Yığın boş olduğu için tepe (top) elemanı incelenemedi.',
        metrics: {
          comparisons: 1,
          operations: 0,
          timeComplexity: 'O(1)',
          spaceComplexity: 'O(n)',
          customMetrics: { 'Yığın Boyutu': 0, Kapasite: capacity },
        },
      },
    ];
  }

  const topIdx = currentItems.length - 1;
  const topItem = currentItems[topIdx];

  return [
    {
      structureState: {
        items: [...currentItems],
        capacity,
        lastAction: 'peek',
        highlightedId: topItem.id,
      },
      activeIndicesOrNodes: [topItem.id, topIdx],
      pointers: { top: topIdx },
      operationType: 'peek',
      codeLine: 7,
      statusNote: `Tepe elemanı incelendi: ${topItem.value} (Yığında herhangi bir değişiklik yapılmadı).`,
      metrics: {
        comparisons: 0,
        operations: 1,
        timeComplexity: 'O(1)',
        spaceComplexity: 'O(n)',
        customMetrics: { 'Tepe Elemanı': topItem.value, 'Yığın Boyutu': currentItems.length },
      },
    },
  ];
}
