import { AlimentationAnswers, TransportAnswers } from '@domain/types/simulation-answers';
import { inject, injectable } from 'inversify';
import { PickOne, SimulationStore, SimulationStoreToken } from '../ports/stores/simulation-store';

export const SaveSimulationAnswerUseCaseToken = Symbol.for('SaveSimulationAnswerUseCase');

@injectable()
export class SaveSimulationAnswerUseCase {
  constructor(@inject(SimulationStoreToken) private readonly simulationStore: SimulationStore) {}

  execute(answer: PickOne<AlimentationAnswers & TransportAnswers>): void {
    if (answer) {
      this.simulationStore.saveAnswer(answer);
    }
  }
}
