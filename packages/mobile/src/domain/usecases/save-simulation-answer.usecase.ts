import { AlimentationAnswers, SimulationAnswers, TransportAnswers } from '@domain/types/simulation-answers';
import { inject, injectable } from 'inversify';
import { AnswerKey, AnswerValues, PickOne, SimulationStore, SimulationStoreToken } from '../ports/stores/simulation-store';

export const SaveSimulationAnswerUseCaseToken = Symbol.for('SaveSimulationAnswerUseCase');

@injectable()
export class SaveSimulationAnswerUseCase {
  constructor(@inject(SimulationStoreToken) private readonly simulationStore: SimulationStore) {}

  execute({
    sector,
    answerKey,
    answer,
  }: {
    sector: keyof SimulationAnswers;
    answerKey: AnswerKey;
    answer: AnswerValues | undefined;
  }): void {
    if (answer) {
      this.simulationStore.saveAnswer(sector, answerKey, answer);
    }
  }

  executeOne(answer: PickOne<AlimentationAnswers & TransportAnswers>): void {
    if (answer) {
      this.simulationStore.saveAnswerOne(answer);
    }
  }
}
