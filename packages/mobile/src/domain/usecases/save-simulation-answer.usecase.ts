import { inject, injectable } from 'inversify';
import { SimulationStore, SimulationStoreToken } from '../ports/stores/simulation-store';

export const SaveSimulationAnswerUseCaseToken = Symbol.for('SaveSimulationAnswerUseCase');

@injectable()
export class SaveSimulationAnswerUseCase {
  constructor(@inject(SimulationStoreToken) private readonly simulationStore: SimulationStore) {}

  async execute<T>(answer: T | null): Promise<void> {
    if (answer) {
      this.simulationStore.saveAnswer(answer);
    }
  }
}
