import { QuestionsNavigation } from '@domain/entites/questions-navigation';
import { QuestionsController, QuestionsControllerToken } from '@domain/ports/controllers/questions-controller';
import { DeepNullable } from '@domain/types/nullable';
import { inject, injectable } from 'inversify';
import { AnswerToSave, SimulationStore, SimulationStoreToken } from '../ports/stores/simulation-store';

export const SaveSimulationAnswerUseCaseToken = Symbol.for('SaveSimulationAnswerUseCase');

@injectable()
export class SaveSimulationAnswerUseCase {
  constructor(
    @inject(SimulationStoreToken) private readonly simulationStore: SimulationStore,
    @inject(QuestionsControllerToken) private readonly questionsController: QuestionsController,
  ) {}
  readonly #questionsNavigation = new QuestionsNavigation();

  execute(answer: DeepNullable<AnswerToSave>): void {
    if (this.#hasNoNull(answer)) {
      this.simulationStore.saveAnswer(answer);

      const nextQuestion = this.#questionsNavigation.getNextQuestion(
        this.simulationStore.getSimulationsAnswers(),
        this.simulationStore.getCurrentQuestion(),
        answer,
      );

      if (nextQuestion) {
        this.questionsController.showNextQuestion(nextQuestion);
        this.simulationStore.setCurrentQuestion(nextQuestion);
      }
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
