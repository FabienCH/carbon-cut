import { AnswerToSave } from '@domain/ports/stores/simulation-store';
import { SimulationAnswers } from '@domain/types/simulation-answers';
import { BreakfastTypes, EngineType } from 'carbon-cut-commons';

export enum QuestionIds {
  Breakfast = 'Breakfast',
  HotBeverages = 'HotBeverages',
  ColdBeverages = 'ColdBeverages',
  MilkType = 'MilkType',
  Meals = 'Meals',
  CarKmType = 'CarKmType',
  FuelCarConsumption = 'FuelCarConsumption',
  ElectricCarSize = 'ElectricCarSize',
}

export class QuestionsNavigation {
  readonly #questions: Record<number, QuestionIds> = {
    0: QuestionIds.Breakfast,
    1: QuestionIds.HotBeverages,
    2: QuestionIds.MilkType,
    3: QuestionIds.ColdBeverages,
    4: QuestionIds.Meals,
    5: QuestionIds.CarKmType,
    6: QuestionIds.ElectricCarSize,
    7: QuestionIds.FuelCarConsumption,
  };

  getNextQuestion(
    currentQuestion: QuestionIds,
    simulationAnswers: SimulationAnswers | undefined,
    answer: AnswerToSave,
  ): QuestionIds | undefined {
    const nextQuestionIdx = Object.values(this.#questions).reduce((questionIdx, questionId, idx) => {
      if (questionId === currentQuestion) {
        questionIdx += this.#getNextIndex(answer, simulationAnswers, idx, currentQuestion);
      }
      return questionIdx;
    }, 0);

    return this.#questions[nextQuestionIdx];
  }

  #getNextIndex(
    answer: AnswerToSave,
    simulationAnswers: SimulationAnswers | undefined,
    currentQuestionIdx: number,
    currentQuestion: QuestionIds,
  ): number {
    const nextQuestionIncrement =
      this.#mustSkipMilkType(currentQuestion, simulationAnswers, answer) ||
      this.#mustSkipFuelCarConsumption(currentQuestion, simulationAnswers) ||
      this.#mustSkipElectricCarSize(currentQuestion, answer)
        ? 2
        : 1;

    return currentQuestionIdx + nextQuestionIncrement;
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
