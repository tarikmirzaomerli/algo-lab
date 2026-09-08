import type { StepSnapshot, VisualizerItemMetadata } from '../../engine/types';

export interface ListNode {
  id: string;
  value: number;
  nextId: string | null;
}

export type LinkedListState = {
  nodes: ListNode[];
  headId: string | null;
  lastAction?: 'insertHead' | 'insertTail' | 'insertIndex' | 'delete' | 'search' | 'reverse' | 'init';
  highlightedNodeId?: string;
  ghostNode?: ListNode; // Newly allocated node before connecting
};

export const LINKED_LIST_METADATA: VisualizerItemMetadata = {
  id: 'linked-list',
  name: 'Singly Linked List (Tek Yönlü Bağlı Liste)',
  shortName: 'Linked List',
  category: 'linear',
  kind: 'structure',
  description:
    'Hafızada ardışık olmayan, her düğümün bir değer ve bir sonraki düğümün adresini (pointer) tuttuğu dinamik veri yapısı.',
  complexity: {
    time: {
      best: 'O(1)', // Head insert/delete
      average: 'O(n)', // Search / index access
      worst: 'O(n)',
    },
    space: 'O(n)',
  },
  pseudocode: [
    { line: 1, code: 'function insertHead(value):' },
    { line: 2, code: '  newNode = Node(value)' },
    { line: 3, code: '  newNode.next = head' },
    { line: 4, code: '  head = newNode' },
    { line: 5, code: 'function delete(value):' },
    { line: 6, code: '  curr = head, prev = null' },
    { line: 7, code: '  while curr and curr.val != value:' },
    { line: 8, code: '    prev = curr; curr = curr.next' },
    { line: 9, code: '  if curr: prev.next = curr.next' },
  ],
  properties: {
    access: 'Sequential (O(n))',
    insertHead: 'O(1) Instant',
  },
};

export function getOrderedNodes(state: LinkedListState): ListNode[] {
  const nodeMap = new Map(state.nodes.map((n) => [n.id, n]));
  const ordered: ListNode[] = [];
  let currId = state.headId;
  const visited = new Set<string>();

  while (currId && nodeMap.has(currId) && !visited.has(currId)) {
    visited.add(currId);
    const node = nodeMap.get(currId)!;
    ordered.push(node);
    currId = node.nextId;
  }
  return ordered;
}

export function createInitialLinkedList(values: number[] = [12, 24, 36, 48]): LinkedListState {
  const nodes: ListNode[] = [];
  let headId: string | null = null;

  for (let i = 0; i < values.length; i++) {
    const id = `node-${Date.now()}-${i}-${values[i]}`;
    nodes.push({
      id,
      value: values[i],
      nextId: null,
    });
    if (i === 0) headId = id;
    if (i > 0) {
      nodes[i - 1].nextId = id;
    }
  }

  return {
    nodes,
    headId,
    lastAction: 'init',
  };
}

export function generateInsertHeadSnapshots(
  state: LinkedListState,
  value: number
): StepSnapshot<LinkedListState>[] {
  const snapshots: StepSnapshot<LinkedListState>[] = [];
  const existingNodes = state.nodes.map((n) => ({ ...n }));
  const oldHeadId = state.headId;

  if (existingNodes.length >= 6) {
    snapshots.push({
      structureState: { ...state, lastAction: 'insertHead' },
      activeIndicesOrNodes: [],
      operationType: 'compare',
      codeLine: 2,
      statusNote: 'Görselleştirme sınırı: Liste maksimum 6 düğüm alabilir.',
      metrics: {
        comparisons: 0,
        operations: 0,
        timeComplexity: 'O(1)',
        spaceComplexity: 'O(n)',
        customMetrics: { 'Düğüm Sayısı': existingNodes.length },
      },
    });
    return snapshots;
  }

  const newNode: ListNode = {
    id: `node-${Date.now()}-${value}`,
    value,
    nextId: null,
  };

  // Step 1: Create orphan node
  snapshots.push({
    structureState: {
      nodes: existingNodes,
      headId: oldHeadId,
      ghostNode: { ...newNode },
      lastAction: 'insertHead',
      highlightedNodeId: newNode.id,
    },
    activeIndicesOrNodes: [newNode.id],
    pointers: { newNode: value, head: oldHeadId ? 'mevcut' : 'null' },
    operationType: 'insert',
    codeLine: 2,
    statusNote: `Yeni bağımsız düğüm Node(${value}) bellekte oluşturuldu.`,
    metrics: {
      comparisons: 0,
      operations: 1,
      timeComplexity: 'O(1)',
      spaceComplexity: 'O(n)',
      customMetrics: { 'Düğüm Sayısı': existingNodes.length + 1 },
    },
  });

  // Step 2: Connect newNode.next to head
  const nodeWithNext: ListNode = {
    ...newNode,
    nextId: oldHeadId,
  };

  snapshots.push({
    structureState: {
      nodes: [nodeWithNext, ...existingNodes],
      headId: oldHeadId,
      ghostNode: undefined,
      lastAction: 'insertHead',
      highlightedNodeId: newNode.id,
    },
    activeIndicesOrNodes: [newNode.id],
    pointers: { newNode: value, next: oldHeadId || 'NULL' },
    operationType: 'insert',
    codeLine: 3,
    statusNote: `Yeni düğümün next işaretçisi mevcut başa (head) bağlandı.`,
    metrics: {
      comparisons: 0,
      operations: 2,
      timeComplexity: 'O(1)',
      spaceComplexity: 'O(n)',
      customMetrics: { 'Düğüm Sayısı': existingNodes.length + 1 },
    },
  });

  // Step 3: Update head = newNode
  snapshots.push({
    structureState: {
      nodes: [nodeWithNext, ...existingNodes],
      headId: newNode.id,
      ghostNode: undefined,
      lastAction: 'insertHead',
      highlightedNodeId: newNode.id,
    },
    activeIndicesOrNodes: [newNode.id],
    pointers: { head: newNode.id },
    operationType: 'settled',
    codeLine: 4,
    statusNote: `head işaretçisi Node(${value}) olarak güncellendi. Başa ekleme tamamlandı.`,
    metrics: {
      comparisons: 0,
      operations: 3,
      timeComplexity: 'O(1)',
      spaceComplexity: 'O(n)',
      customMetrics: { 'Düğüm Sayısı': existingNodes.length + 1 },
    },
  });

  return snapshots;
}

export function generateInsertTailSnapshots(
  state: LinkedListState,
  value: number
): StepSnapshot<LinkedListState>[] {
  const snapshots: StepSnapshot<LinkedListState>[] = [];
  const existingNodes = state.nodes.map((n) => ({ ...n }));
  const ordered = getOrderedNodes(state);

  if (existingNodes.length >= 6) {
    return [
      {
        structureState: { ...state, lastAction: 'insertTail' },
        activeIndicesOrNodes: [],
        operationType: 'compare',
        codeLine: 2,
        statusNote: 'Görselleştirme sınırı: Liste maksimum 6 düğüm alabilir.',
        metrics: { comparisons: 0, operations: 0, timeComplexity: 'O(n)', spaceComplexity: 'O(n)' },
      },
    ];
  }

  if (ordered.length === 0) {
    return generateInsertHeadSnapshots(state, value);
  }

  const newNode: ListNode = {
    id: `node-${Date.now()}-${value}`,
    value,
    nextId: null,
  };

  // Traverse to tail
  let ops = 0;
  for (let i = 0; i < ordered.length; i++) {
    ops++;
    const curr = ordered[i];
    const isTail = i === ordered.length - 1;

    snapshots.push({
      structureState: {
        nodes: existingNodes,
        headId: state.headId,
        lastAction: 'insertTail',
        highlightedNodeId: curr.id,
      },
      activeIndicesOrNodes: [curr.id],
      pointers: { curr: curr.value, head: ordered[0].value },
      operationType: 'traverse',
      codeLine: 7,
      statusNote: isTail
        ? `Listenin sonuna ulaşıldı (Tail: Node(${curr.value})).`
        : `Son düğümü bulmak için Node(${curr.value}) üzerinden ilerleniyor...`,
      metrics: {
        comparisons: i + 1,
        operations: ops,
        timeComplexity: 'O(n)',
        spaceComplexity: 'O(n)',
        customMetrics: { 'Konum': `${i + 1} / ${ordered.length}` },
      },
    });
  }

  // Connect tail.next = newNode
  const lastNodeId = ordered[ordered.length - 1].id;
  const updatedNodes = existingNodes.map((n) => (n.id === lastNodeId ? { ...n, nextId: newNode.id } : n));
  updatedNodes.push(newNode);

  snapshots.push({
    structureState: {
      nodes: updatedNodes,
      headId: state.headId,
      lastAction: 'insertTail',
      highlightedNodeId: newNode.id,
    },
    activeIndicesOrNodes: [newNode.id, lastNodeId],
    pointers: { tail: newNode.value, head: ordered[0].value },
    operationType: 'settled',
    codeLine: 4,
    statusNote: `Tail.next -> Node(${value}) bağlandı. Sona ekleme tamamlandı.`,
    metrics: {
      comparisons: ordered.length,
      operations: ops + 2,
      timeComplexity: 'O(n)',
      spaceComplexity: 'O(n)',
      customMetrics: { 'Düğüm Sayısı': updatedNodes.length },
    },
  });

  return snapshots;
}

export function generateDeleteNodeSnapshots(
  state: LinkedListState,
  targetValue: number
): StepSnapshot<LinkedListState>[] {
  const snapshots: StepSnapshot<LinkedListState>[] = [];
  const ordered = getOrderedNodes(state);

  if (ordered.length === 0) {
    return [
      {
        structureState: { ...state, lastAction: 'delete' },
        activeIndicesOrNodes: [],
        operationType: 'not-found',
        codeLine: 6,
        statusNote: 'Liste boş, silinecek düğüm bulunmuyor.',
        metrics: { comparisons: 0, operations: 0, timeComplexity: 'O(1)', spaceComplexity: 'O(n)' },
      },
    ];
  }

  let prevNode: ListNode | null = null;
  let targetIndex = -1;

  for (let i = 0; i < ordered.length; i++) {
    const curr = ordered[i];
    const isMatch = curr.value === targetValue;

    snapshots.push({
      structureState: {
        nodes: state.nodes.map((n) => ({ ...n })),
        headId: state.headId,
        lastAction: 'delete',
        highlightedNodeId: curr.id,
      },
      activeIndicesOrNodes: [curr.id, ...(prevNode ? [prevNode.id] : [])],
      pointers: {
        curr: curr.value,
        prev: prevNode ? prevNode.value : 'NULL',
        target: targetValue,
      },
      operationType: isMatch ? 'compare' : 'traverse',
      codeLine: 7,
      statusNote: isMatch
        ? `Hedef düğüm bulundu: Node(${curr.value}) == ${targetValue}!`
        : `Node(${curr.value}) inceleniyor (${curr.value} != ${targetValue}), devam ediliyor...`,
      metrics: {
        comparisons: i + 1,
        operations: i + 1,
        timeComplexity: 'O(n)',
        spaceComplexity: 'O(n)',
        customMetrics: { İncelenen: curr.value },
      },
    });

    if (isMatch) {
      targetIndex = i;
      break;
    }
    prevNode = curr;
  }

  if (targetIndex === -1) {
    snapshots.push({
      structureState: { ...state, lastAction: 'delete' },
      activeIndicesOrNodes: [],
      operationType: 'not-found',
      codeLine: 7,
      statusNote: `Değer (${targetValue}) listede bulunamadı, silme yapılamadı.`,
      metrics: {
        comparisons: ordered.length,
        operations: ordered.length,
        timeComplexity: 'O(n)',
        spaceComplexity: 'O(n)',
      },
    });
    return snapshots;
  }

  const nodeToDelete = ordered[targetIndex];

  // Reroute pointers
  let newHeadId = state.headId;
  let updatedNodes: ListNode[] = [];

  if (targetIndex === 0) {
    // Delete head
    newHeadId = nodeToDelete.nextId;
    updatedNodes = state.nodes.filter((n) => n.id !== nodeToDelete.id);
  } else {
    // Delete middle or tail
    updatedNodes = state.nodes
      .filter((n) => n.id !== nodeToDelete.id)
      .map((n) => (n.id === prevNode!.id ? { ...n, nextId: nodeToDelete.nextId } : n));
  }

  snapshots.push({
    structureState: {
      nodes: updatedNodes,
      headId: newHeadId,
      lastAction: 'delete',
    },
    activeIndicesOrNodes: prevNode ? [prevNode.id] : (newHeadId ? [newHeadId] : []),
    pointers: {
      head: newHeadId ? (updatedNodes.find((n) => n.id === newHeadId)?.value ?? 'NULL') : 'NULL',
    },
    operationType: 'settled',
    codeLine: 9,
    statusNote: `Node(${targetValue}) listeden çıkarıldı ve bağlantı okları yeniden yönlendirildi.`,
    metrics: {
      comparisons: targetIndex + 1,
      operations: targetIndex + 3,
      timeComplexity: 'O(n)',
      spaceComplexity: 'O(n)',
      customMetrics: { 'Kalan Düğüm': updatedNodes.length },
    },
  });

  return snapshots;
}

export function generateSearchSnapshots(
  state: LinkedListState,
  targetValue: number
): StepSnapshot<LinkedListState>[] {
  const snapshots: StepSnapshot<LinkedListState>[] = [];
  const ordered = getOrderedNodes(state);

  if (ordered.length === 0) {
    return [
      {
        structureState: { ...state, lastAction: 'search' },
        activeIndicesOrNodes: [],
        operationType: 'not-found',
        codeLine: 6,
        statusNote: 'Liste boş, arama başarısız.',
        metrics: { comparisons: 0, operations: 0, timeComplexity: 'O(n)', spaceComplexity: 'O(n)' },
      },
    ];
  }

  let found = false;

  for (let i = 0; i < ordered.length; i++) {
    const curr = ordered[i];
    const isMatch = curr.value === targetValue;

    snapshots.push({
      structureState: {
        nodes: state.nodes.map((n) => ({ ...n })),
        headId: state.headId,
        lastAction: 'search',
        highlightedNodeId: curr.id,
      },
      activeIndicesOrNodes: [curr.id],
      pointers: { curr: curr.value, index: i, target: targetValue },
      operationType: isMatch ? 'found' : 'traverse',
      codeLine: 7,
      statusNote: isMatch
        ? `Aranan değer (${targetValue}) ${i}. indekste (Node: ${curr.value}) bulundu!`
        : `Node(${curr.value}) inceleniyor (${curr.value} != ${targetValue})...`,
      metrics: {
        comparisons: i + 1,
        operations: i + 1,
        timeComplexity: 'O(n)',
        spaceComplexity: 'O(n)',
        customMetrics: { 'Mevcut İndeks': i },
      },
    });

    if (isMatch) {
      found = true;
      break;
    }
  }

  if (!found) {
    snapshots.push({
      structureState: { ...state, lastAction: 'search' },
      activeIndicesOrNodes: [],
      operationType: 'not-found',
      codeLine: 8,
      statusNote: `Aranan ${targetValue} değeri listede bulunamadı (NULL ulaşıldı).`,
      metrics: {
        comparisons: ordered.length,
        operations: ordered.length,
        timeComplexity: 'O(n)',
        spaceComplexity: 'O(n)',
      },
    });
  }

  return snapshots;
}
