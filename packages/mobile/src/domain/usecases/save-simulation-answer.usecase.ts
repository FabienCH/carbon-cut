import { DeepNullable } from '@domain/types/nullable';
import { inject, injectable } from 'inversify';
import { AnswerToSave, SimulationStore, SimulationStoreToken } from '../ports/stores/simulation-store';

export const SaveSimulationAnswerUseCaseToken = Symbol.for('SaveSimulationAnswerUseCase');

@injectable()
export class SaveSimulationAnswerUseCase {
  constructor(@inject(SimulationStoreToken) private readonly simulationStore: SimulationStore) {}

  execute(answer: DeepNullable<AnswerToSave>): void {
    if (this.#hasNoNull(answer)) {
      this.simulationStore.saveAnswer(answer);
    }
  }

  #hasNoNull(answer: DeepNullable<AnswerToSave>): answer is AnswerToSave {
    return Object.values(answer).every((answerVal) => {
      if (typeof answerVal !== 'object') {
        return answerVal !== null;
      }

      return this.#hasNoNull(answerVal);
    });
  }
}
