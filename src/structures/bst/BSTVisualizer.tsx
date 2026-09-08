import React, { useMemo } from 'react';
import type { StepSnapshot } from '../../engine/types';
import type { BSTState } from './bstEngine';
import './BSTVisualizer.css';

interface BSTVisualizerProps {
  snapshot?: StepSnapshot<BSTState>;
  currentState: BSTState;
}

interface RenderNode {
  id: string;
  value: number;
  x: number;
  y: number;
  leftId: string | null;
  rightId: string | null;
}

export const BSTVisualizer: React.FC<BSTVisualizerProps> = ({ snapshot, currentState }) => {
  const stateToRender =
    snapshot?.structureState &&
    typeof snapshot.structureState.nodes === 'object' &&
    !Array.isArray(snapshot.structureState.nodes)
      ? snapshot.structureState
      : currentState;
  const highlightedNodeId = stateToRender.highlightedNodeId;
  const visitedSequence = stateToRender.visitedSequence || [];
  const activeIds = snapshot?.activeIndicesOrNodes || [];
  const opType = snapshot?.operationType || 'idle';

  // Compute hierarchical tree layout coordinates
  const { renderNodes, connections, treeWidth, treeHeight } = useMemo(() => {
    const nodes = stateToRender.nodes || {};
    const rootId = stateToRender.rootId;

    if (!rootId || !nodes[rootId]) {
      return { renderNodes: [], connections: [], treeWidth: 600, treeHeight: 340 };
    }

    const nodePositions: Record<string, { x: number; y: number }> = {};
    const conns: { parentId: string; childId: string; px: number; py: number; cx: number; cy: number }[] = [];

    const baseWidth = 640;
    const levelHeight = 70;

    const assignCoords = (
      nodeId: string | null,
      depth: number,
      minX: number,
      maxX: number
    ) => {
      if (!nodeId || !nodes[nodeId]) return;
      const node = nodes[nodeId];
      const x = (minX + maxX) / 2;
      const y = 40 + depth * levelHeight;

      nodePositions[nodeId] = { x, y };

      if (node.leftId && nodes[node.leftId]) {
        assignCoords(node.leftId, depth + 1, minX, x);
        const childPos = nodePositions[node.leftId];
        conns.push({
          parentId: nodeId,
          childId: node.leftId,
          px: x,
          py: y,
          cx: childPos.x,
          cy: childPos.y,
        });
      }

      if (node.rightId && nodes[node.rightId]) {
        assignCoords(node.rightId, depth + 1, x, maxX);
        const childPos = nodePositions[node.rightId];
        conns.push({
          parentId: nodeId,
          childId: node.rightId,
          px: x,
          py: y,
          cx: childPos.x,
          cy: childPos.y,
        });
      }
    };

    assignCoords(rootId, 0, 30, baseWidth - 30);

    const rNodes: RenderNode[] = Object.keys(nodePositions).map((id) => {
      const node = nodes[id];
      const pos = nodePositions[id];
      return {
        id,
        value: node.value,
        x: pos.x,
        y: pos.y,
        leftId: node.leftId,
        rightId: node.rightId,
      };
    });

    return { renderNodes: rNodes, connections: conns, treeWidth: baseWidth, treeHeight: 320 };
  }, [stateToRender]);

  return (
    <div className="bst-visualizer-container">
      {/* Top Status Ribbon */}
      <div className="bst-status-ribbon">
        <div className="bst-badge-pill">
          <span className="badge-dot" />
          <span>Düğüm Sayısı: {renderNodes.length}</span>
        </div>
        <div className="bst-badge-pill secondary">
          <span>Sol &lt; Kök &lt; Sağ</span>
        </div>
      </div>

      {/* Main SVG Tree Canvas */}
      <div className="bst-canvas-stage">
        {renderNodes.length === 0 ? (
          <div className="bst-empty-box">
            <span>Ağaç Boş (Root = NULL)</span>
          </div>
        ) : (
          <svg
            className="bst-svg"
            viewBox={`0 0 ${treeWidth} ${treeHeight}`}
            preserveAspectRatio="xMidYMid meet"
          >
            {/* Smooth Bezier Connecting Branches */}
            {connections.map((conn) => {
              const pathD = `M ${conn.px} ${conn.py + 18} C ${conn.px} ${(conn.py + conn.cy) / 2}, ${conn.cx} ${(conn.py + conn.cy) / 2}, ${conn.cx} ${conn.cy - 18}`;
              return (
                <path
                  key={`${conn.parentId}->${conn.childId}`}
                  d={pathD}
                  fill="none"
                  stroke="#2B2623"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  className="branch-path"
                />
              );
            })}

            {/* Tree Nodes */}
            {renderNodes.map((node) => {
              const isHighlighted = highlightedNodeId === node.id || activeIds.includes(node.id);
              const isFound = isHighlighted && opType === 'found';
              const isComparing = isHighlighted && opType === 'compare';
              const isVisiting = isHighlighted && opType === 'visit';
              const isSettled = isHighlighted && opType === 'settled';

              let nodeClass = 'tree-node-circle';
              if (isFound) nodeClass += ' node-found';
              else if (isVisiting) nodeClass += ' node-visiting';
              else if (isComparing) nodeClass += ' node-comparing';
              else if (isSettled) nodeClass += ' node-settled';

              return (
                <g key={node.id} transform={`translate(${node.x}, ${node.y})`}>
                  {/* Node Circle */}
                  <circle r="22" className={nodeClass} />

                  {/* Node Value */}
                  <text
                    className="tree-node-text"
                    textAnchor="middle"
                    dominantBaseline="central"
                  >
                    {node.value}
                  </text>
                </g>
              );
            })}
          </svg>
        )}
      </div>

      {/* Visited Sequence Output Ribbon (For Traversals) */}
      {visitedSequence.length > 0 && (
        <div className="visited-sequence-bar">
          <span className="sequence-title">ZİYARET SIRASI:</span>
          <div className="sequence-pill-list">
            {visitedSequence.map((val, idx) => (
              <div key={idx} className="sequence-chip">
                <span className="chip-idx">#{idx + 1}</span>
                <span className="chip-val">{val}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
