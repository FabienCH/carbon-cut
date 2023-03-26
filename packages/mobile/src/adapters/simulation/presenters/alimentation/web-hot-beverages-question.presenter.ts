import { PositiveNumberError } from '@domain/entites/answer-validator';
import { NumericAnswerHelper } from '@domain/entites/numeric-answer-helper';
import { ConditionalNextQuestion } from '@domain/ports/presenters/conditionnal-next-question';
import {
  InputAnswer,
  InputAnswerValue,
  MultipleAnswersViewModel,
  QuestionPresenterViewModel,
  QuestionViewModel,
} from '@domain/ports/presenters/question.presenter';
import { AllRoutes, Routes } from '@infrastructure/root-navigation';
import { BreakfastTypes, HotBeveragesAnswer } from 'carbon-cut-commons';
import { injectable } from 'inversify';
import { selectSimulationAnswers } from '../../../simulation-results/store/selectors/simulation-selectors';
import { WebInputNumberQuestionPresenter } from '../web-input-number-question.presenter';

export type HotBeveragesKeys = keyof HotBeveragesAnswer;
export type HotBeverageViewModel = QuestionPresenterViewModel<
  QuestionViewModel<QuestionViewModel<MultipleAnswersViewModel<HotBeverageAnswerValue>>>
>;
type HotBeverageAnswerValue = InputAnswer<HotBeveragesKeys>;

@injectable()
export class WebHotBeveragesQuestionPresenter
  extends WebInputNumberQuestionPresenter<HotBeveragesAnswer, HotBeverageViewModel>
  implements ConditionalNextQuestion
{
  get answerValues(): HotBeveragesAnswer {
    return this._viewModel.answers.reduce((hotBeverages, answer) => {
      hotBeverages = { ...hotBeverages, [answer.id]: NumericAnswerHelper.valueToNumber(answer.value) };
      return hotBeverages;
    }, {} as HotBeveragesAnswer);
  }

  protected readonly _viewModel: HotBeverageViewModel = {
    question: 'Quelle est votre consommation de boissons chaudes par semaine ?',
    answers: [
      { id: 'coffee', label: 'Café', placeholder: 'Cafés / semaine', value: undefined },
      { id: 'tea', label: 'Thé', placeholder: 'Thés / semaine', value: undefined },
      { id: 'hotChocolate', label: 'Chocolat chaud', placeholder: 'Chocolat chaud / semaine', value: undefined },
    ],
    canSubmit: false,
  };

  setAnswer({ id, value }: InputAnswerValue<HotBeveragesKeys>, error: PositiveNumberError, canSubmit: boolean): void {
    const answers = this._viewModel.answers.map((answer) => {
      if (answer.id === id) {
        return this.updateAnswer(answer, value, error);
      }

      return answer;
    });

    this.updateViewModel({ answers, canSubmit });
  }

  getNextQuestion(): Routes {
    const isBreakFastWithoutMilk = selectSimulationAnswers()?.alimentation?.breakfast !== BreakfastTypes.milkCerealBreakfast;
    const noHotChocolate = this.#noHotChocolate();
    return isBreakFastWithoutMilk && noHotChocolate ? AllRoutes.ColdBeverages : AllRoutes.MilkType;
  }

  #noHotChocolate(): boolean {
    const hotChocolateValue = this._viewModel.answers.find((answer) => answer.id === 'hotChocolate')?.value;
    return !hotChocolateValue || hotChocolateValue === '0';
  }
}
