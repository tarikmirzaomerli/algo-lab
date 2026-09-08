import React from 'react';
import type { StepSnapshot } from '../../engine/types';
import { type LinkedListState, getOrderedNodes } from './linkedListEngine';
import './LinkedListVisualizer.css';

interface LinkedListVisualizerProps {
  snapshot?: StepSnapshot<LinkedListState>;
  currentState: LinkedListState;
}

export const LinkedListVisualizer: React.FC<LinkedListVisualizerProps> = ({
  snapshot,
  currentState,
}) => {
  const stateToRender =
    snapshot?.structureState && Array.isArray(snapshot.structureState.nodes)
      ? snapshot.structureState
      : currentState;
  const orderedNodes = getOrderedNodes(stateToRender);
  const ghostNode = stateToRender.ghostNode;
  const activeIds = snapshot?.activeIndicesOrNodes || [];
  const opType = snapshot?.operationType || 'idle';
  const highlightedNodeId = stateToRender.highlightedNodeId;

  return (
    <div className="linked-list-visualizer-container">
      {/* Top Status Ribbon */}
      <div className="ll-status-ribbon">
        <div className="ll-badge-pill">
          <span className="badge-dot" />
          <span>Düğüm Sayısı: {orderedNodes.length}</span>
        </div>
        <div className="ll-badge-pill secondary">
          <span>Head ➜ [Val | Next] ➜ NULL</span>
        </div>
      </div>

      {/* Main Chain Canvas */}
      <div className="chain-stage">
        {/* Head Marker */}
        <div className="head-marker-col">
          <div className="head-badge">HEAD</div>
          <div className="head-arrow">▼</div>
        </div>

        {/* Nodes and Connectors Chain */}
        <div className="chain-nodes-row">
          {orderedNodes.length === 0 && !ghostNode && (
            <div className="empty-list-card">
              <span>Liste Boş (head = NULL)</span>
            </div>
          )}

          {/* Render Ghost Node if in orphan creation state */}
          {ghostNode && (
            <div className="ghost-node-wrapper">
              <div className="ghost-tag">YENİ DÜĞÜM</div>
              <div className="node-box ghost-active">
                <div className="node-val-compartment">{ghostNode.value}</div>
                <div className="node-next-compartment">
                  <span className="next-dot">●</span>
                </div>
              </div>
            </div>
          )}

          {orderedNodes.map((node, idx) => {
            const isHighlighted = highlightedNodeId === node.id || activeIds.includes(node.id);
            const isFound = isHighlighted && opType === 'found';
            const isTraverse = isHighlighted && opType === 'traverse';
            const isInsert = isHighlighted && opType === 'insert';

            let nodeClass = 'node-box';
            if (isFound) nodeClass += ' node-found';
            else if (isTraverse) nodeClass += ' node-traverse';
            else if (isInsert) nodeClass += ' node-insert';
            else if (isHighlighted) nodeClass += ' node-active';

            const isLast = idx === orderedNodes.length - 1;

            return (
              <React.Fragment key={node.id}>
                <div className="node-wrapper" id={`node-elem-${node.id}`}>
                  <div className="node-index-tag">#{idx}</div>

                  <div className={nodeClass}>
                    <div className="node-val-compartment">
                      <span className="node-val-text">{node.value}</span>
                    </div>
                    <div className="node-next-compartment" title="Next Pointer">
                      <span className="next-dot">●</span>
                    </div>
                  </div>
                </div>

                {/* Arrow Connector between nodes */}
                <div className="connector-block">
                  <svg className="connector-svg" width="54" height="24" viewBox="0 0 54 24">
                    <line
                      x1="4"
                      y1="12"
                      x2="46"
                      y2="12"
                      stroke="#2B2623"
                      strokeWidth="2.5"
                      strokeLinecap="round"
                    />
                    <polygon points="46,7 54,12 46,17" fill="#2B2623" />
                  </svg>
                </div>

                {/* If last node, render NULL terminator box */}
                {isLast && (
                  <div className="null-terminator-box">
                    <span>NULL</span>
                  </div>
                )}
              </React.Fragment>
            );
          })}
        </div>
      </div>
    </div>
  );
};
