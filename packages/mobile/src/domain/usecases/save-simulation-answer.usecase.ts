import { SimulationDto } from 'carbon-cut-commons';
import { inject, injectable } from 'inversify';
import { SimulationStore, SimulationStoreToken } from '../ports/stores/simulation-store';

export const SaveSimulationAnswerUseCaseToken = Symbol.for('SaveSimulationAnswerUseCase');

@injectable()
export class SaveSimulationAnswerUseCase {
  constructor(@inject(SimulationStoreToken) private readonly simulationStore: SimulationStore) {}

  async execute({
    answerKey,
    answer,
  }: {
    answerKey: keyof SimulationDto;
    answer: SimulationDto[typeof answerKey] | undefined;
  }): Promise<void> {
    if (answer) {
      this.simulationStore.saveAnswer({ [answerKey]: answer });
    }
  }
}
