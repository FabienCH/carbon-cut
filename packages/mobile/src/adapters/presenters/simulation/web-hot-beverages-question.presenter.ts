import { BreakfastTypes, HotBeveragesAnswer } from 'carbon-cut-commons';
import { injectable } from 'inversify';
import { QuestionViewModel } from '../../../domain/ports/presenters/question.presenter';
import { Routes } from '../../../infrastructure/root-navigation';
import { selectSimulationAnswers } from '../../../infrastructure/store/selectors/simulation-selectors';
import { WebInputNumberQuestionPresenter } from './web-input-number-question.presenter';

export type HotBeveragesKeys = keyof HotBeveragesAnswer;

@injectable()
export class WebHotBeveragesQuestionPresenter extends WebInputNumberQuestionPresenter<HotBeveragesAnswer> {
  readonly viewModel: QuestionViewModel<HotBeveragesKeys, string> = {
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

  getAnswers(): HotBeveragesAnswer {
    return this.viewModel.questions[0].answers.reduce((hotBeverages, answer) => {
      hotBeverages = { ...hotBeverages, [answer.id]: this.valueToNumber(answer.value) };
      return hotBeverages;
    }, {} as HotBeveragesAnswer);
  }

  nextNavigateRoute(): Routes {
    const isBreakFastWithoutMilk = selectSimulationAnswers()?.breakfast !== BreakfastTypes.milkCerealBreakfast;
    const noHotChocolate = this.#noHotChocolate();
    return isBreakFastWithoutMilk && noHotChocolate ? Routes.ColdBeverages : Routes.MilkType;
  }

  #noHotChocolate(): boolean {
    const hotChocolateValue = this.viewModel.questions[0].answers.find((answer) => answer.id === 'hotChocolate')?.value;
    return !hotChocolateValue || hotChocolateValue === '0';
  }
}
