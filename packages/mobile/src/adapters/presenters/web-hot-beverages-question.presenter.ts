import { BreakfastTypes, HotBeveragesAnswer } from 'carbon-cut-commons';
import { injectable } from 'inversify';
import { Answer, QuestionPresenter, QuestionViewModel } from '../../domain/ports/presenters/question.presenter';
import { Routes } from '../../infrastructure/root-navigation';
import { selectSimulationAnswers } from '../../infrastructure/store/selectors/simulation-selectors';

export type HotBeveragesKeys = keyof HotBeveragesAnswer;

@injectable()
export class WebHotBeveragesQuestionPresenter implements QuestionPresenter<number | string> {
  readonly viewModel: QuestionViewModel<HotBeveragesKeys, number> = {
    questions: [
      {
        question: 'Quelle est votre consommation de boissons chaudes par semaine ?',
        answers: [
          { id: 'coffee', label: 'Café', placeholder: 'Cafés / semaine', value: null },
          { id: 'tea', label: 'Thé', placeholder: 'Thés / semaine', value: null },
          { id: 'hotChocolate', label: 'Chocolat chaud', placeholder: 'Chocolat chaud / semaine', value: null },
        ],
      },
    ],
    canSubmit: false,
  };

  setAnswer({ key, value }: { key: HotBeveragesKeys; value: string }): void {
    const isPositiveNumber = value?.match(/^[0-9]+$/);
    const intValue = parseInt(value, 10);

    this.viewModel.questions[0].answers = this.viewModel.questions[0].answers.map((answer) =>
      answer.id === key ? this.#updateAnswer(answer, intValue, !!isPositiveNumber) : answer,
    );
    this.viewModel.canSubmit = this.viewModel.questions[0].answers.every((answer) => answer.value !== null);
  }

  simulationBeverages(): HotBeveragesAnswer {
    return this.viewModel.questions[0].answers.reduce((hotBeverages, answer) => {
      hotBeverages = { ...hotBeverages, [answer.id]: answer.value };
      return hotBeverages;
    }, {} as HotBeveragesAnswer);
  }

  nextNavigateRoute(): Routes {
    const isBreakFastWithoutMilk = selectSimulationAnswers()?.breakfast !== BreakfastTypes.milkCerealBreakfast;
    const noHotChocolate = this.#noHotChocolate();
    return isBreakFastWithoutMilk && noHotChocolate ? Routes.ColdBeveragesAnswer : Routes.MilkType;
  }

  #noHotChocolate(): boolean {
    const hotChocolateValue = this.viewModel.questions[0].answers.find((answer) => answer.id === 'hotChocolate')?.value;
    return !hotChocolateValue || hotChocolateValue === 0;
  }

  #updateAnswer(answer: Answer<HotBeveragesKeys, number | null>, value: number, isPositiveNumber: boolean) {
    const updatedAnswer = isPositiveNumber
      ? { value, errorMessage: undefined }
      : { value: null, errorMessage: `Veuillez saisir un nombre${isNaN(value) ? '' : ' positif'}` };

    return { ...answer, ...updatedAnswer };
  }
}
