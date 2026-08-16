import React, { useState } from 'react';
import { Header } from './components/layout/Header';
import { Sidebar } from './components/layout/Sidebar';
import { ArrayVisualizer } from './components/visualizer/ArrayVisualizer';
import { GraphVisualizer } from './components/visualizer/GraphVisualizer';
import { StepExplanationPanel } from './components/panels/StepExplanationPanel';
import { InfoPanel } from './components/panels/InfoPanel';
import { ControlBar } from './components/controls/ControlBar';
import { useAlgorithmRunner } from './hooks/useAlgorithmRunner';
import type { AlgorithmStep } from './types/event';
import type { GraphAlgorithmStep } from './types/graph';
import { BookOpen, Activity } from 'lucide-react';
import './App.css';

export const App: React.FC = () => {
  const {
    selectedAlgoId,
    algorithm,
    arraySize,
    preset,
    initialArray,
    initialGraph,
    currentStepIdx,
    currentStep,
    totalSteps,
    isPlaying,
    speed,
    selectAlgorithm,
    setSpeed,
    setArraySize,
    generateData,
    randomizeTarget,
    togglePlay,
    stepForward,
    stepBackward,
    restart,
  } = useAlgorithmRunner('bubble-sort', 12);

  const [activeRightTab, setActiveRightTab] = useState<'step' | 'info'>('step');

  return (
    <div className="app-container">
      <Header />

      <div className="app-main-layout">
        {/* Left Sidebar */}
        <Sidebar
          selectedAlgoId={selectedAlgoId}
          onSelectAlgorithm={selectAlgorithm}
        />

        {/* Middle Main Workspace */}
        <main className="main-workspace">
          <div className="visualizer-wrapper">
            {algorithm.metadata.category === 'graph' ? (
              <GraphVisualizer
                step={currentStep as GraphAlgorithmStep}
                initialGraph={initialGraph}
              />
            ) : (
              <ArrayVisualizer
                step={currentStep as AlgorithmStep}
                initialArray={initialArray}
                onRandomizeTarget={randomizeTarget}
              />
            )}
          </div>

          <div className="control-bar-wrapper">
            <ControlBar
              isPlaying={isPlaying}
              speed={speed}
              arraySize={arraySize}
              preset={preset}
              currentStepIdx={currentStepIdx}
              totalSteps={totalSteps}
              onTogglePlay={togglePlay}
              onStepForward={stepForward}
              onStepBackward={stepBackward}
              onRestart={restart}
              onSetSpeed={setSpeed}
              onSetArraySize={setArraySize}
              onGenerateData={generateData}
            />
          </div>
        </main>

        {/* Right Info & Explanation Panel */}
        <aside className="right-panel" aria-label="Açıklama ve Bilgi Paneli">
          <div className="right-panel-tabs">
            <button
              className={`panel-tab ${activeRightTab === 'step' ? 'active' : ''}`}
              onClick={() => setActiveRightTab('step')}
            >
              <Activity size={16} />
              <span>Adım Anlatımı</span>
            </button>
            <button
              className={`panel-tab ${activeRightTab === 'info' ? 'active' : ''}`}
              onClick={() => setActiveRightTab('info')}
            >
              <BookOpen size={16} />
              <span>Nasıl Çalışır? & Karmaşıklık</span>
            </button>
          </div>

          <div className="panel-tab-content">
            {activeRightTab === 'step' ? (
              <StepExplanationPanel
                step={currentStep}
                currentStepIdx={currentStepIdx}
                totalSteps={totalSteps}
                selectedAlgoId={selectedAlgoId}
                algoName={algorithm.metadata.name}
              />
            ) : (
              <InfoPanel metadata={algorithm.metadata} />
            )}
          </div>
        </aside>
      </div>
    </div>
  );
};

export default App;
