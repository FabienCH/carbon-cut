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
  #currentQuestionId = this.#questions[0];

  getNextQuestion(simulationAnswers: SimulationAnswers | undefined, answer: AnswerToSave): QuestionIds | undefined {
    const nextQuestionIdx = Object.values(this.#questions).reduce((questionIdx, questionId, idx) => {
      if (questionId === this.#currentQuestionId) {
        questionIdx += this.#getNextIndex(answer, simulationAnswers, idx);
      }
      return questionIdx;
    }, 0);

    this.#currentQuestionId = this.#questions[nextQuestionIdx];
    return this.#currentQuestionId;
  }

  #getNextIndex(answer: AnswerToSave, simulationAnswers: SimulationAnswers | undefined, currentQuestionIdx: number): number {
    const nextQuestionIncrement =
      this.#mustSkipMilkType(simulationAnswers, answer) ||
      this.#mustSkipFuelCarConsumption(simulationAnswers) ||
      this.#mustSkipElectricCarSize(answer)
        ? 2
        : 1;

    return currentQuestionIdx + nextQuestionIncrement;
  }

  #mustSkipMilkType(simulationAnswers: SimulationAnswers | undefined, answer: AnswerToSave): boolean {
    return (
      this.#currentQuestionId === QuestionIds.HotBeverages &&
      simulationAnswers?.alimentation?.breakfast !== BreakfastTypes.milkCerealBreakfast &&
      !answer?.hotBeverages?.hotChocolate
    );
  }

  #mustSkipFuelCarConsumption(simulationAnswers: SimulationAnswers | undefined): boolean {
    return (
      this.#currentQuestionId === QuestionIds.ElectricCarSize && simulationAnswers?.transport?.carUsage.engineType !== EngineType.electric
    );
  }

  #mustSkipElectricCarSize(answer: AnswerToSave): boolean {
    return this.#currentQuestionId === QuestionIds.CarKmType && answer?.carUsage?.engineType !== EngineType.electric;
  }
}
