import { QuestionIds } from '@domain/entites/questions-navigation';
import { QuestionsController, QuestionsControllerToken } from '@domain/ports/controllers/questions-controller';
import { DeepNullable } from '@domain/types/nullable';
import { SimulationAnswers } from '@domain/types/simulation-answers';
import { BreakfastTypes, EngineType } from 'carbon-cut-commons';
import { inject, injectable } from 'inversify';
import { AnswerToSave, SimulationStore, SimulationStoreToken } from '../ports/stores/simulation-store';

export const SaveSimulationAnswerUseCaseToken = Symbol.for('SaveSimulationAnswerUseCase');

@injectable()
export class SaveSimulationAnswerUseCase {
  constructor(
    @inject(SimulationStoreToken) private readonly simulationStore: SimulationStore,
    @inject(QuestionsControllerToken) private readonly questionsController: QuestionsController,
  ) {}

  #questions: Record<number, QuestionIds> = {
    0: QuestionIds.Breakfast,
    1: QuestionIds.HotBeverages,
    2: QuestionIds.MilkType,
    3: QuestionIds.ColdBeverages,
    4: QuestionIds.Meals,
    5: QuestionIds.CarKmType,
    6: QuestionIds.ElectricCarSize,
    7: QuestionIds.FuelCarConsumption,
  };

  execute(answer: DeepNullable<AnswerToSave>): void {
    if (this.#hasNoNull(answer)) {
      const currentQuestion = this.questionsController.currentQuestion;
      const nextQuestionIdx = Object.values(this.#questions).reduce((questionIdx, questionId, idx) => {
        if (questionId === currentQuestion) {
          questionIdx += this.#getNextIndex(answer, idx, currentQuestion);
        }
        return questionIdx;
      }, 0);

      this.simulationStore.saveAnswer(answer);
      const nextQuestion = this.#questions[nextQuestionIdx];
      if (nextQuestion) {
        this.questionsController.showNextQuestion(nextQuestion);
      }
    }
  }

  #getNextIndex(answer: AnswerToSave, currentQuestionIdx: number, currentQuestion: QuestionIds): number {
    const simulationAnswers = this.simulationStore.getSimulationsAnswers();
    const nextQuestionIncrement =
      this.#mustSkipMilkType(currentQuestion, simulationAnswers, answer) ||
      this.#mustSkipFuelCarConsumption(currentQuestion, simulationAnswers) ||
      this.#mustSkipElectricCarSize(currentQuestion, answer)
        ? 2
        : 1;

    return currentQuestionIdx + nextQuestionIncrement;
  }

  #hasNoNull(answer: DeepNullable<AnswerToSave>): answer is AnswerToSave {
    return Object.values(answer).every((answerVal) => {
      if (typeof answerVal !== 'object') {
        return answerVal !== null;
      }

      return this.#hasNoNull(answerVal);
    });
  }

  #mustSkipMilkType(currentQuestion: QuestionIds, simulationAnswers: SimulationAnswers | undefined, answer: AnswerToSave): boolean {
    return (
      currentQuestion === QuestionIds.HotBeverages &&
      simulationAnswers?.alimentation?.breakfast !== BreakfastTypes.milkCerealBreakfast &&
      !answer?.hotBeverages?.hotChocolate
    );
  }

  #mustSkipFuelCarConsumption(currentQuestion: QuestionIds, simulationAnswers: SimulationAnswers | undefined): boolean {
    return currentQuestion === QuestionIds.ElectricCarSize && simulationAnswers?.transport?.carUsage.engineType !== EngineType.electric;
  }

  #mustSkipElectricCarSize(currentQuestion: QuestionIds, answer: AnswerToSave): boolean {
    return currentQuestion === QuestionIds.CarKmType && answer?.carUsage?.engineType !== EngineType.electric;
  }
}
