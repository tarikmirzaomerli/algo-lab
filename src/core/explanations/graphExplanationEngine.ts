import type { GraphSimulationEvent, GraphAlgorithmStep } from '../../types/graph';
import { explainGraphStep } from './graphExplanations';

export function generateGraphStepExplanation(event: GraphSimulationEvent) {
  return explainGraphStep(event);
}

export function enrichGraphEvents(events: GraphSimulationEvent[]): GraphAlgorithmStep[] {
  return events.map((event) => ({
    ...event,
    ...generateGraphStepExplanation(event),
  }));
}
