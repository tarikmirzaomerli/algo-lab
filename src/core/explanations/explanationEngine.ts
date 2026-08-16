import type { SimulationEvent, StepExplanation, AlgorithmStep } from '../../types/event';
import { isSearchMeta } from '../../types/event';
import { explainSearchStep } from './searchExplanations';
import { explainSortStep } from './sortExplanations';

/**
 * Anlatım Motoru (Explanation Engine)
 * Ham algoritma simülasyon olayını (SimulationEvent) alır ve dilden/anlatım kurallarından
 * bağımsız olarak açıklama (StepExplanation) üretir.
 */
export function generateStepExplanation(event: SimulationEvent): StepExplanation {
  if (isSearchMeta(event.meta)) {
    return explainSearchStep(event);
  }
  return explainSortStep(event);
}

/**
 * Ham Olay Dizisini (SimulationEvent[]) alıp UI bileşenlerinin tüketebileceği
 * AlgorithmStep[] dizisine dönüştüren yardımcı fonksiyon.
 */
export function enrichSimulationEvents(events: SimulationEvent[]): AlgorithmStep[] {
  return events.map((event) => ({
    ...event,
    ...generateStepExplanation(event),
  }));
}
