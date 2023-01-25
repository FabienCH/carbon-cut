import { BreakfastTypes, HotBeveragesAnswer } from 'carbon-cut-commons';
import { injectable } from 'inversify';
import {
  InputAnswer,
  MultipleAnswersViewModel,
  QuestionPresenterViewModel,
  QuestionViewModel,
} from '../../../domain/ports/presenters/question.presenter';
import { Routes } from '../../../infrastructure/root-navigation';
import { selectSimulationAnswers } from '../../simulation-results/store/selectors/simulation-selectors';
import { WebInputNumberQuestionPresenter } from './web-input-number-question.presenter';

export type HotBeveragesKeys = keyof HotBeveragesAnswer;
export type HotBeverageViewModel = QuestionPresenterViewModel<
  QuestionViewModel<QuestionViewModel<MultipleAnswersViewModel<HotBeverageAnswerValue[]>>>
>;
type HotBeverageAnswerValue = InputAnswer<HotBeveragesKeys, string | null>;

@injectable()
export class WebHotBeveragesQuestionPresenter extends WebInputNumberQuestionPresenter<HotBeveragesAnswer, HotBeverageViewModel> {
  get answerValues(): HotBeveragesAnswer {
    return this._viewModel.answers.reduce((hotBeverages, answer) => {
      hotBeverages = { ...hotBeverages, [answer.id]: this.valueToNumber(answer.value) };
      return hotBeverages;
    }, {} as HotBeveragesAnswer);
  }

  protected readonly _viewModel: HotBeverageViewModel = {
    question: 'Quelle est votre consommation de boissons chaudes par semaine ?',
    answers: [
      { id: 'coffee', label: 'Café', placeholder: 'Cafés / semaine', value: null },
      { id: 'tea', label: 'Thé', placeholder: 'Thés / semaine', value: null },
      { id: 'hotChocolate', label: 'Chocolat chaud', placeholder: 'Chocolat chaud / semaine', value: null },
    ],
    canSubmit: false,
  };

  setAnswer({ key, value }: { key: HotBeveragesKeys; value: string | null }): void {
    const answers = this._viewModel.answers.map((answer) => {
      if (answer.id === key) {
        return this.updateAnswer(answer, value);
      }

      return answer;
    });
    const canSubmit = answers.every((answer) => {
      const floatValue = parseFloat(answer?.value ?? '');
      return !isNaN(floatValue) && floatValue >= 0;
    });
    this.updateViewModel({ answers, canSubmit });
  }

  nextNavigateRoute(): Routes {
    const isBreakFastWithoutMilk = selectSimulationAnswers()?.breakfast !== BreakfastTypes.milkCerealBreakfast;
    const noHotChocolate = this.#noHotChocolate();
    return isBreakFastWithoutMilk && noHotChocolate ? Routes.ColdBeverages : Routes.MilkType;
  }

  #noHotChocolate(): boolean {
    const hotChocolateValue = this._viewModel.answers.find((answer) => answer.id === 'hotChocolate')?.value;
    return !hotChocolateValue || hotChocolateValue === '0';
  }
}
