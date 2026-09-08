import type { StepSnapshot, VisualizerItemMetadata } from '../../engine/types';

export interface QueueItem {
  id: string;
  value: number;
}

export type QueueState = {
  items: QueueItem[];
  capacity: number;
  lastAction?: 'enqueue' | 'dequeue' | 'peek' | 'clear' | 'init';
  highlightedId?: string;
};

export const QUEUE_METADATA: VisualizerItemMetadata = {
  id: 'queue',
  name: 'Queue (Kuyruk)',
  shortName: 'Queue',
  category: 'linear',
  kind: 'structure',
  description:
    'İlk giren ilk çıkar (FIFO - First In First Out) prensibine sahip doğrusal veri yapısı.',
  complexity: {
    time: {
      best: 'O(1)',
      average: 'O(1)',
      worst: 'O(1)',
    },
    space: 'O(n)',
  },
  pseudocode: [
    { line: 1, code: 'function enqueue(value):' },
    { line: 2, code: '  if size == capacity: return OVERFLOW' },
    { line: 3, code: '  rear = (rear + 1) % capacity' },
    { line: 4, code: '  queue[rear] = value; size++' },
    { line: 5, code: 'function dequeue():' },
    { line: 6, code: '  if size == 0: return UNDERFLOW' },
    { line: 7, code: '  value = queue[front]' },
    { line: 8, code: '  front = (front + 1) % capacity; size--; return value' },
  ],
  properties: {
    principle: 'FIFO (First In First Out)',
    access: 'Front (dequeue/peek) & Rear (enqueue)',
  },
};

export const MAX_QUEUE_CAPACITY = 7;

export function createInitialQueue(values: number[] = [15, 30, 45, 60]): QueueState {
  return {
    items: values.map((val, idx) => ({ id: `q-item-${Date.now()}-${idx}-${val}`, value: val })),
    capacity: MAX_QUEUE_CAPACITY,
    lastAction: 'init',
  };
}

export function generateQueueEnqueueSnapshots(
  currentState: QueueState,
  newValue: number
): StepSnapshot<QueueState>[] {
  const snapshots: StepSnapshot<QueueState>[] = [];
  const currentItems = [...currentState.items];
  const capacity = currentState.capacity || MAX_QUEUE_CAPACITY;

  // Step 1: Check capacity
  snapshots.push({
    structureState: {
      items: [...currentItems],
      capacity,
      lastAction: 'enqueue',
    },
    activeIndicesOrNodes: [],
    pointers: {
      front: currentItems.length > 0 ? 0 : -1,
      rear: currentItems.length > 0 ? currentItems.length - 1 : -1,
    },
    operationType: 'compare',
    codeLine: 2,
    statusNote:
      currentItems.length >= capacity
        ? `Taşma (Overflow): Kuyruk kapasitesi (${capacity}) dolu, yeni eleman eklenemez!`
        : `Kuyruk kapasitesi kontrol ediliyor: ${currentItems.length} / ${capacity} dolu.`,
    metrics: {
      comparisons: 1,
      operations: 0,
      timeComplexity: 'O(1)',
      spaceComplexity: 'O(n)',
      customMetrics: { 'Kuyruk Boyutu': currentItems.length, Kapasite: capacity },
    },
  });

  if (currentItems.length >= capacity) {
    return snapshots;
  }

  // Step 2: Allocate at rear
  const newItem: QueueItem = {
    id: `q-item-${Date.now()}-${newValue}`,
    value: newValue,
  };

  snapshots.push({
    structureState: {
      items: [...currentItems],
      capacity,
      lastAction: 'enqueue',
      highlightedId: newItem.id,
    },
    activeIndicesOrNodes: [newItem.id],
    pointers: {
      front: 0,
      rear: currentItems.length,
      incoming: newValue,
    },
    operationType: 'enqueue',
    codeLine: 3,
    statusNote: `${newValue} değeri kuyruğun arkasına (rear) girmek üzere hazırlandı.`,
    metrics: {
      comparisons: 1,
      operations: 1,
      timeComplexity: 'O(1)',
      spaceComplexity: 'O(n)',
      customMetrics: { 'Kuyruk Boyutu': currentItems.length + 1, Kapasite: capacity },
    },
  });

  // Step 3: Enqueue and settle
  const updatedItems = [...currentItems, newItem];
  const newRear = updatedItems.length - 1;

  snapshots.push({
    structureState: {
      items: updatedItems,
      capacity,
      lastAction: 'enqueue',
      highlightedId: newItem.id,
    },
    activeIndicesOrNodes: [newItem.id, newRear],
    pointers: { front: 0, rear: newRear },
    operationType: 'settled',
    codeLine: 4,
    statusNote: `${newValue} kuyruğun arkasına eklendi. (front = 0, rear = ${newRear})`,
    metrics: {
      comparisons: 1,
      operations: 2,
      timeComplexity: 'O(1)',
      spaceComplexity: 'O(n)',
      customMetrics: { 'Kuyruk Boyutu': updatedItems.length, Kapasite: capacity },
    },
  });

  return snapshots;
}

export function generateQueueDequeueSnapshots(currentState: QueueState): StepSnapshot<QueueState>[] {
  const snapshots: StepSnapshot<QueueState>[] = [];
  const currentItems = [...currentState.items];
  const capacity = currentState.capacity || MAX_QUEUE_CAPACITY;

  // Step 1: Check underflow
  snapshots.push({
    structureState: {
      items: [...currentItems],
      capacity,
      lastAction: 'dequeue',
    },
    activeIndicesOrNodes: [],
    pointers: {
      front: currentItems.length > 0 ? 0 : -1,
      rear: currentItems.length > 0 ? currentItems.length - 1 : -1,
    },
    operationType: 'compare',
    codeLine: 6,
    statusNote:
      currentItems.length === 0
        ? 'Boş Kuyruk Hatası (Underflow): Kuyrukta çıkarılacak eleman yok!'
        : 'Kuyruk boş mu kontrol edildi. Eleman mevcut.',
    metrics: {
      comparisons: 1,
      operations: 0,
      timeComplexity: 'O(1)',
      spaceComplexity: 'O(n)',
      customMetrics: { 'Kuyruk Boyutu': currentItems.length, Kapasite: capacity },
    },
  });

  if (currentItems.length === 0) {
    return snapshots;
  }

  const dequeuedItem = currentItems[0];

  // Step 2: Highlight front exiting
  snapshots.push({
    structureState: {
      items: [...currentItems],
      capacity,
      lastAction: 'dequeue',
      highlightedId: dequeuedItem.id,
    },
    activeIndicesOrNodes: [dequeuedItem.id, 0],
    pointers: { front: 0, exiting: dequeuedItem.value },
    operationType: 'dequeue',
    codeLine: 7,
    statusNote: `Kuyruğun en önündeki eleman (${dequeuedItem.value}) çıkış yapıyor (FIFO).`,
    metrics: {
      comparisons: 1,
      operations: 1,
      timeComplexity: 'O(1)',
      spaceComplexity: 'O(n)',
      customMetrics: { 'Kuyruk Boyutu': currentItems.length, Kapasite: capacity },
    },
  });

  // Step 3: Shift remaining items left
  const remainingItems = currentItems.slice(1);
  const newRear = remainingItems.length > 0 ? remainingItems.length - 1 : -1;

  snapshots.push({
    structureState: {
      items: remainingItems,
      capacity,
      lastAction: 'dequeue',
    },
    activeIndicesOrNodes: remainingItems.length > 0 ? [remainingItems[0].id, 0] : [],
    pointers: {
      front: remainingItems.length > 0 ? 0 : -1,
      rear: newRear,
    },
    operationType: 'settled',
    codeLine: 8,
    statusNote: `${dequeuedItem.value} başarıyla çıkarıldı. Kuyruk sola kaydı (Yeni ön eleman: ${remainingItems.length > 0 ? remainingItems[0].value : 'Boş'}).`,
    metrics: {
      comparisons: 1,
      operations: 2,
      timeComplexity: 'O(1)',
      spaceComplexity: 'O(n)',
      customMetrics: { 'Kuyruk Boyutu': remainingItems.length, Kapasite: capacity },
    },
  });

  return snapshots;
}

export function generateQueuePeekSnapshots(currentState: QueueState): StepSnapshot<QueueState>[] {
  const currentItems = [...currentState.items];
  const capacity = currentState.capacity || MAX_QUEUE_CAPACITY;

  if (currentItems.length === 0) {
    return [
      {
        structureState: { ...currentState, lastAction: 'peek' },
        activeIndicesOrNodes: [],
        pointers: { front: -1, rear: -1 },
        operationType: 'not-found',
        codeLine: 6,
        statusNote: 'Kuyruk boş olduğu için ön (front) elemanı incelenemedi.',
        metrics: {
          comparisons: 1,
          operations: 0,
          timeComplexity: 'O(1)',
          spaceComplexity: 'O(n)',
          customMetrics: { 'Kuyruk Boyutu': 0, Kapasite: capacity },
        },
      },
    ];
  }

  const frontItem = currentItems[0];

  return [
    {
      structureState: {
        items: [...currentItems],
        capacity,
        lastAction: 'peek',
        highlightedId: frontItem.id,
      },
      activeIndicesOrNodes: [frontItem.id, 0],
      pointers: { front: 0, rear: currentItems.length - 1 },
      operationType: 'peek',
      codeLine: 7,
      statusNote: `Ön (front) elemanı incelendi: ${frontItem.value} (Kuyruk durumu değişmedi).`,
      metrics: {
        comparisons: 0,
        operations: 1,
        timeComplexity: 'O(1)',
        spaceComplexity: 'O(n)',
        customMetrics: { 'Ön Eleman': frontItem.value, 'Kuyruk Boyutu': currentItems.length },
      },
    },
  ];
}
