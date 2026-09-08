import type { StepSnapshot, VisualizerItemMetadata } from '../../engine/types';

export interface BSTNode {
  id: string;
  value: number;
  leftId: string | null;
  rightId: string | null;
}

export type BSTState = {
  nodes: Record<string, BSTNode>;
  rootId: string | null;
  lastAction?:
    | 'insert'
    | 'search'
    | 'delete'
    | 'inorder'
    | 'preorder'
    | 'postorder'
    | 'levelorder'
    | 'init';
  highlightedNodeId?: string;
  visitedSequence?: number[];
  targetValue?: number;
};

export const BST_METADATA: VisualizerItemMetadata = {
  id: 'bst',
  name: 'Binary Search Tree (İkili Arama Ağacı)',
  shortName: 'BST',
  category: 'tree',
  kind: 'structure',
  description:
    'Her düğümün sol alt ağacındaki tüm değerlerin o düğümden küçük, sağ alt ağacındakilerin ise büyük olduğu hiyerarşik ağaç yapısı.',
  complexity: {
    time: {
      best: 'O(log n)',
      average: 'O(log n)',
      worst: 'O(n)', // Unbalanced tree
    },
    space: 'O(h) [Yükseklik]',
  },
  pseudocode: [
    { line: 1, code: 'function insert(node, value):' },
    { line: 2, code: '  if node == null: return Node(value)' },
    { line: 3, code: '  if value < node.val:' },
    { line: 4, code: '    node.left = insert(node.left, value)' },
    { line: 5, code: '  else if value > node.val:' },
    { line: 6, code: '    node.right = insert(node.right, value)' },
    { line: 7, code: '  return node' },
  ],
  properties: {
    ordering: 'Left < Parent < Right',
    inorderProperty: 'Yields Sorted Array',
  },
};

export function createInitialBST(values: number[] = [45, 25, 65, 15, 35, 55, 75]): BSTState {
  const nodes: Record<string, BSTNode> = {};
  let rootId: string | null = null;

  for (const val of values) {
    const id = `bst-node-${val}`;
    const newNode: BSTNode = { id, value: val, leftId: null, rightId: null };
    nodes[id] = newNode;

    if (!rootId) {
      rootId = id;
    } else {
      let currId: string = rootId;
      while (currId) {
        const curr = nodes[currId];
        if (val < curr.value) {
          if (!curr.leftId) {
            curr.leftId = id;
            break;
          }
          currId = curr.leftId;
        } else if (val > curr.value) {
          if (!curr.rightId) {
            curr.rightId = id;
            break;
          }
          currId = curr.rightId;
        } else {
          break; // Duplicate
        }
      }
    }
  }

  return {
    nodes,
    rootId,
    lastAction: 'init',
  };
}

export function generateBSTInsertSnapshots(
  state: BSTState,
  value: number
): StepSnapshot<BSTState>[] {
  const snapshots: StepSnapshot<BSTState>[] = [];
  const nodesCopy: Record<string, BSTNode> = JSON.parse(JSON.stringify(state.nodes));
  const rootId = state.rootId;

  // Case 1: Empty tree
  if (!rootId) {
    const newId = `bst-node-${value}`;
    const newNode: BSTNode = { id: newId, value, leftId: null, rightId: null };
    nodesCopy[newId] = newNode;

    snapshots.push({
      structureState: {
        nodes: nodesCopy,
        rootId: newId,
        lastAction: 'insert',
        highlightedNodeId: newId,
      },
      activeIndicesOrNodes: [newId],
      pointers: { root: value },
      operationType: 'insert',
      codeLine: 2,
      statusNote: `Ağaç boş olduğu için Node(${value}) kök (root) düğüm olarak eklendi.`,
      metrics: {
        comparisons: 0,
        operations: 1,
        timeComplexity: 'O(1)',
        spaceComplexity: 'O(1)',
        customMetrics: { 'Düğüm Sayısı': 1 },
      },
    });
    return snapshots;
  }

  // Case 2: Traverse and find insertion point
  let currId: string | null = rootId;
  let comparisons = 0;
  let operations = 0;
  const newId = `bst-node-${value}`;

  while (currId) {
    comparisons++;
    operations++;
    const curr: BSTNode = nodesCopy[currId];
    if (!curr) break;
    const isSmaller: boolean = value < curr.value;
    const isGreater: boolean = value > curr.value;

    snapshots.push({
      structureState: {
        nodes: JSON.parse(JSON.stringify(nodesCopy)),
        rootId,
        lastAction: 'insert',
        highlightedNodeId: curr.id,
      },
      activeIndicesOrNodes: [curr.id],
      pointers: { curr: curr.value, inserting: value },
      operationType: 'compare',
      codeLine: isSmaller ? 3 : 5,
      statusNote: isSmaller
        ? `${value} < ${curr.value}: Sol alt ağaca doğru ilerleniyor.`
        : isGreater
        ? `${value} > ${curr.value}: Sağ alt ağaca doğru ilerleniyor.`
        : `Düğüm (${value}) zaten ağaçta mevcut (Yinelenen değer).`,
      metrics: {
        comparisons,
        operations,
        timeComplexity: 'O(log n)',
        spaceComplexity: 'O(h)',
        customMetrics: { 'İncelenen Düğüm': curr.value },
      },
    });

    if (isSmaller) {
      if (!curr.leftId) {
        // Insert left
        nodesCopy[newId] = { id: newId, value, leftId: null, rightId: null };
        curr.leftId = newId;
        operations++;

        snapshots.push({
          structureState: {
            nodes: JSON.parse(JSON.stringify(nodesCopy)),
            rootId,
            lastAction: 'insert',
            highlightedNodeId: newId,
          },
          activeIndicesOrNodes: [newId, curr.id],
          pointers: { parent: curr.value, newChild: value },
          operationType: 'settled',
          codeLine: 4,
          statusNote: `Node(${value}), Node(${curr.value})'ın sol çocuğu olarak eklendi.`,
          metrics: {
            comparisons,
            operations,
            timeComplexity: 'O(log n)',
            spaceComplexity: 'O(h)',
            customMetrics: { 'Toplam Düğüm': Object.keys(nodesCopy).length },
          },
        });
        break;
      }
      currId = curr.leftId;
    } else if (isGreater) {
      if (!curr.rightId) {
        // Insert right
        nodesCopy[newId] = { id: newId, value, leftId: null, rightId: null };
        curr.rightId = newId;
        operations++;

        snapshots.push({
          structureState: {
            nodes: JSON.parse(JSON.stringify(nodesCopy)),
            rootId,
            lastAction: 'insert',
            highlightedNodeId: newId,
          },
          activeIndicesOrNodes: [newId, curr.id],
          pointers: { parent: curr.value, newChild: value },
          operationType: 'settled',
          codeLine: 6,
          statusNote: `Node(${value}), Node(${curr.value})'ın sağ çocuğu olarak eklendi.`,
          metrics: {
            comparisons,
            operations,
            timeComplexity: 'O(log n)',
            spaceComplexity: 'O(h)',
            customMetrics: { 'Toplam Düğüm': Object.keys(nodesCopy).length },
          },
        });
        break;
      }
      currId = curr.rightId;
    } else {
      // Duplicate
      break;
    }
  }

  return snapshots;
}

export function generateBSTSearchSnapshots(
  state: BSTState,
  targetValue: number
): StepSnapshot<BSTState>[] {
  const snapshots: StepSnapshot<BSTState>[] = [];
  const rootId = state.rootId;
  const nodes = state.nodes;

  if (!rootId) {
    return [
      {
        structureState: { ...state, lastAction: 'search', targetValue },
        activeIndicesOrNodes: [],
        operationType: 'not-found',
        codeLine: 2,
        statusNote: 'Ağaç boş, aranan değer bulunamadı.',
        metrics: { comparisons: 0, operations: 0, timeComplexity: 'O(1)', spaceComplexity: 'O(1)' },
      },
    ];
  }

  let currId: string | null = rootId;
  let comparisons = 0;
  let found = false;

  while (currId) {
    comparisons++;
    const curr: BSTNode | undefined = nodes[currId];
    if (!curr) break;

    const isMatch: boolean = curr.value === targetValue;
    const isSmaller: boolean = targetValue < curr.value;

    snapshots.push({
      structureState: {
        nodes: state.nodes,
        rootId,
        lastAction: 'search',
        highlightedNodeId: curr.id,
        targetValue,
      },
      activeIndicesOrNodes: [curr.id],
      pointers: { curr: curr.value, target: targetValue },
      operationType: isMatch ? 'found' : 'compare',
      codeLine: isMatch ? 2 : isSmaller ? 3 : 5,
      statusNote: isMatch
        ? `Tebrikler! Aranan ${targetValue} değeri Node(${curr.value}) olarak bulundu!`
        : isSmaller
        ? `${targetValue} < ${curr.value}: Sol alt ağaca iniliyor...`
        : `${targetValue} > ${curr.value}: Sağ alt ağaca iniliyor...`,
      metrics: {
        comparisons,
        operations: comparisons,
        timeComplexity: 'O(log n)',
        spaceComplexity: 'O(h)',
        customMetrics: { 'Adım Sayısı': comparisons },
      },
    });

    if (isMatch) {
      found = true;
      break;
    }

    currId = isSmaller ? curr.leftId : curr.rightId;
  }

  if (!found) {
    snapshots.push({
      structureState: {
        nodes: state.nodes,
        rootId,
        lastAction: 'search',
        targetValue,
      },
      activeIndicesOrNodes: [],
      pointers: { target: targetValue },
      operationType: 'not-found',
      codeLine: 2,
      statusNote: `Aranan ${targetValue} değeri ağaçta bulunamadı (Yaprak düğüme ulaşıldı).`,
      metrics: {
        comparisons,
        operations: comparisons,
        timeComplexity: 'O(log n)',
        spaceComplexity: 'O(h)',
      },
    });
  }

  return snapshots;
}

export function generateBSTTraversalSnapshots(
  state: BSTState,
  order: 'inorder' | 'preorder' | 'postorder' | 'levelorder'
): StepSnapshot<BSTState>[] {
  const snapshots: StepSnapshot<BSTState>[] = [];
  const rootId = state.rootId;
  const nodes = state.nodes;

  if (!rootId) {
    return [
      {
        structureState: { ...state, lastAction: order, visitedSequence: [] },
        activeIndicesOrNodes: [],
        operationType: 'idle',
        codeLine: 1,
        statusNote: 'Ağaç boş, gezinme yapılamadı.',
        metrics: { comparisons: 0, operations: 0, timeComplexity: 'O(1)', spaceComplexity: 'O(1)' },
      },
    ];
  }

  const visitedNodes: BSTNode[] = [];

  if (order === 'inorder') {
    const traverse = (nodeId: string | null) => {
      if (!nodeId || !nodes[nodeId]) return;
      traverse(nodes[nodeId].leftId);
      visitedNodes.push(nodes[nodeId]);
      traverse(nodes[nodeId].rightId);
    };
    traverse(rootId);
  } else if (order === 'preorder') {
    const traverse = (nodeId: string | null) => {
      if (!nodeId || !nodes[nodeId]) return;
      visitedNodes.push(nodes[nodeId]);
      traverse(nodes[nodeId].leftId);
      traverse(nodes[nodeId].rightId);
    };
    traverse(rootId);
  } else if (order === 'postorder') {
    const traverse = (nodeId: string | null) => {
      if (!nodeId || !nodes[nodeId]) return;
      traverse(nodes[nodeId].leftId);
      traverse(nodes[nodeId].rightId);
      visitedNodes.push(nodes[nodeId]);
    };
    traverse(rootId);
  } else if (order === 'levelorder') {
    const queue: string[] = [rootId];
    while (queue.length > 0) {
      const currId = queue.shift()!;
      const curr = nodes[currId];
      if (curr) {
        visitedNodes.push(curr);
        if (curr.leftId) queue.push(curr.leftId);
        if (curr.rightId) queue.push(curr.rightId);
      }
    }
  }

  const sequence: number[] = [];
  const orderTitle =
    order === 'inorder'
      ? 'In-Order (Sol-Kök-Sağ)'
      : order === 'preorder'
      ? 'Pre-Order (Kök-Sol-Sağ)'
      : order === 'postorder'
      ? 'Post-Order (Sol-Sağ-Kök)'
      : 'Level-Order (Katman Katman / BFS)';

  for (let i = 0; i < visitedNodes.length; i++) {
    const node = visitedNodes[i];
    sequence.push(node.value);

    snapshots.push({
      structureState: {
        nodes: state.nodes,
        rootId,
        lastAction: order,
        highlightedNodeId: node.id,
        visitedSequence: [...sequence],
      },
      activeIndicesOrNodes: [node.id],
      pointers: { visiting: node.value, step: i + 1 },
      operationType: 'visit',
      codeLine: order === 'inorder' ? 3 : order === 'preorder' ? 2 : 4,
      statusNote: `${orderTitle}: Node(${node.value}) ziyaret edildi ve çıktı listesine eklendi.`,
      metrics: {
        comparisons: 0,
        operations: i + 1,
        timeComplexity: 'O(n)',
        spaceComplexity: 'O(n)',
        customMetrics: { 'Ziyaret Edilen': `${i + 1} / ${visitedNodes.length}` },
      },
    });
  }

  return snapshots;
}
