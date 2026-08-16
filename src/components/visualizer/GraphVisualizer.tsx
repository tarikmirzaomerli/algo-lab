import React from 'react';
import type { GraphData, GraphAlgorithmStep } from '../../types/graph';
import { DEFAULT_GRAPH_PRESET } from '../../core/constants/defaultGraph';
import { Layers, ArrowRight } from 'lucide-react';
import './GraphVisualizer.css';

interface GraphVisualizerProps {
  step?: GraphAlgorithmStep;
  initialGraph?: GraphData;
}

export const GraphVisualizer: React.FC<GraphVisualizerProps> = ({
  step,
  initialGraph = DEFAULT_GRAPH_PRESET,
}) => {
  const graph = initialGraph || DEFAULT_GRAPH_PRESET;
  const currentNodeId = step?.currentNodeId;
  const activeEdgeId = step?.activeEdgeId;
  const visitedSet = new Set(step?.visitedNodeIds || []);
  const frontierSet = new Set(step?.frontierNodeIds || []);
  const isDFS = step?.meta?.kind === 'dfs';
  const frontierItems = isDFS
    ? step?.meta?.kind === 'dfs' ? step.meta.stack : step?.frontierNodeIds || []
    : step?.meta?.kind === 'bfs' ? step.meta.queue : step?.frontierNodeIds || [];

  return (
    <div className="graph-visualizer-container" aria-label="Graf Görselleştirici Canvas">
      {/* 1. SVG Canvas Motoru */}
      <div className="graph-svg-wrapper">
        <svg
          className="graph-svg"
          viewBox="0 0 800 450"
          preserveAspectRatio="xMidYMid meet"
          aria-label="Graf Düğüm ve Kenar Şeması"
        >
          {/* A. KENARLAR (EDGES LAYER) - Alt Katman */}
          <g className="edges-layer">
            {graph.edges.map((edge) => {
              const sourceNode = graph.nodes.find((n) => n.id === edge.source);
              const targetNode = graph.nodes.find((n) => n.id === edge.target);

              if (!sourceNode || !targetNode) return null;

              const isActive = edge.id === activeEdgeId;
              const isVisited =
                visitedSet.has(sourceNode.id) && visitedSet.has(targetNode.id);

              let edgeClass = 'edge-default';
              if (isActive) {
                edgeClass = 'edge-active';
              } else if (isVisited) {
                edgeClass = 'edge-visited';
              }

              return (
                <g key={edge.id}>
                  <line
                    x1={sourceNode.x}
                    y1={sourceNode.y}
                    x2={targetNode.x}
                    y2={targetNode.y}
                    className={`graph-edge ${edgeClass}`}
                  />
                  {edge.weight !== undefined && (
                    <text
                      x={(sourceNode.x + targetNode.x) / 2}
                      y={(sourceNode.y + targetNode.y) / 2 - 8}
                      fill="#94a3b8"
                      fontSize="12"
                      textAnchor="middle"
                    >
                      {edge.weight}
                    </text>
                  )}
                </g>
              );
            })}
          </g>

          {/* B. DÜĞÜMLER (NODES LAYER) - Üst Katman */}
          <g className="nodes-layer">
            {graph.nodes.map((node) => {
              const isCurrent = node.id === currentNodeId;
              const isInFrontier = frontierSet.has(node.id);
              const isVisited = visitedSet.has(node.id);

              let nodeClass = 'node-default';
              let badgeText = '';
              let badgeClass = '';

              if (isCurrent) {
                nodeClass = 'node-current';
                badgeText = 'AKTİF';
                badgeClass = 'badge-current';
              } else if (isInFrontier) {
                nodeClass = 'node-in-queue';
                badgeText = isDFS ? 'YIĞINDA' : 'KUYRUKTA';
                badgeClass = 'badge-in-queue';
              } else if (isVisited) {
                nodeClass = 'node-visited';
                badgeText = 'ZİYARET EDİLDİ';
                badgeClass = 'badge-visited';
              }

              return (
                <g
                  key={node.id}
                  className={`graph-node ${nodeClass}`}
                  transform={`translate(${node.x}, ${node.y})`}
                  aria-label={`Düğüm ${node.label} (${badgeText || 'varsayılan'})`}
                >
                  <circle r="26" />
                  <text textAnchor="middle" dy="6">
                    {node.label}
                  </text>

                  {badgeText && (
                    <text
                      y="-34"
                      textAnchor="middle"
                      className={`node-status-badge ${badgeClass}`}
                    >
                      {badgeText}
                    </text>
                  )}
                </g>
              );
            })}
          </g>
        </svg>
      </div>

      {/* 2. CANLI VERİ YAPISI ÇEKMECESİ (Queue / Stack Visualizer) */}
      <div
        className="queue-drawer-panel"
        aria-label={isDFS ? 'DFS Canlı Yığın (Stack) Paneli' : 'BFS Canlı Kuyruk (Queue) Paneli'}
      >
        <div className="queue-drawer-header">
          <Layers size={18} />
          <span>{isDFS ? 'DFS YIĞIN (Stack - LIFO):' : 'BFS KUYRUK (Queue - FIFO):'}</span>
        </div>

        <div className="queue-items-wrapper">
          {frontierItems.length > 0 ? (
            frontierItems.map((item, idx) => {
              const isHighlight = isDFS
                ? idx === frontierItems.length - 1 // Stack Top
                : idx === 0; // Queue Head

              return (
                <React.Fragment key={`${item}-${idx}`}>
                  <div className={`queue-item-box ${isHighlight ? 'is-head' : ''}`}>
                    {item}
                  </div>
                  {idx < frontierItems.length - 1 && (
                    <ArrowRight size={14} className="queue-arrow" color="#64748b" />
                  )}
                </React.Fragment>
              );
            })
          ) : (
            <span className="queue-empty-text">
              {isDFS ? 'Yığın Boş (Stack Empty)' : 'Kuyruk Boş (Queue Empty)'}
            </span>
          )}
        </div>
      </div>
    </div>
  );
};
