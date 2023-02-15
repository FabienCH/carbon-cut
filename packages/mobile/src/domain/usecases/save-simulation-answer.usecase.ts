import { SimulationDto } from 'carbon-cut-commons';
import { inject, injectable } from 'inversify';
import { AnswerKey, AnswerValue, SimulationStore, SimulationStoreToken } from '../ports/stores/simulation-store';

export const SaveSimulationAnswerUseCaseToken = Symbol.for('SaveSimulationAnswerUseCase');

@injectable()
export class SaveSimulationAnswerUseCase {
  constructor(@inject(SimulationStoreToken) private readonly simulationStore: SimulationStore) {}

  execute({ sector, answerKey, answer }: { sector: keyof SimulationDto; answerKey: AnswerKey; answer: AnswerValue | undefined }): void {
    if (answer) {
      this.simulationStore.saveAnswer(sector, { [answerKey]: answer });
    }
  }
}
