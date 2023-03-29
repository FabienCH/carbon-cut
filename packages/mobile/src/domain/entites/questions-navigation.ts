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
    simulationAnswers: SimulationAnswers | undefined,
    currentQuestionId: QuestionIds,
    answer: AnswerToSave,
  ): QuestionIds | undefined {
    const nextQuestionIdx = this.#getNextIndex(answer, simulationAnswers, currentQuestionId);
    console.log('currentQuestionId', currentQuestionId);
    console.log('nextQuestionIdx', nextQuestionIdx);

    return this.#questions[nextQuestionIdx];
  }

  #getNextIndex(answer: AnswerToSave, simulationAnswers: SimulationAnswers | undefined, currentQuestionId: QuestionIds): number {
    const currentQuestionIdx = parseInt(
      Object.keys(this.#questions).find((questionIdx) => this.#questions[parseInt(questionIdx, 10)] === currentQuestionId) ?? '0',
      10,
    );

    const nextIndexIncrement =
      this.#mustSkipMilkType(currentQuestionId, simulationAnswers, answer) ||
      this.#mustSkipFuelCarConsumption(currentQuestionId, simulationAnswers) ||
      this.#mustSkipElectricCarSize(currentQuestionId, answer)
        ? 2
        : 1;

    return currentQuestionIdx + nextIndexIncrement;
  }

  #mustSkipMilkType(currentQuestionId: QuestionIds, simulationAnswers: SimulationAnswers | undefined, answer: AnswerToSave): boolean {
    return (
      currentQuestionId === QuestionIds.HotBeverages &&
      simulationAnswers?.alimentation?.breakfast !== BreakfastTypes.milkCerealBreakfast &&
      !answer?.hotBeverages?.hotChocolate
    );
  }

  #mustSkipFuelCarConsumption(currentQuestionId: QuestionIds, simulationAnswers: SimulationAnswers | undefined): boolean {
    return currentQuestionId === QuestionIds.ElectricCarSize && simulationAnswers?.transport?.carUsage.engineType === EngineType.electric;
  }

  #mustSkipElectricCarSize(currentQuestionId: QuestionIds, answer: AnswerToSave): boolean {
    return currentQuestionId === QuestionIds.CarKmType && answer?.carUsage?.engineType !== EngineType.electric;
  }
}
