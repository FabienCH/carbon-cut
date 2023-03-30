import { PositiveNumberError } from '@domain/entites/answer-validator';
import { NumericAnswerHelper } from '@domain/entites/numeric-answer-helper';
import {
  InputAnswer,
  InputAnswerValue,
  MultipleAnswersViewModel,
  QuestionPresenterViewModel,
  QuestionViewModel,
} from '@domain/ports/presenters/question.presenter';
import { HotBeveragesAnswer } from 'carbon-cut-commons';
import { injectable } from 'inversify';
import { WebInputNumberQuestionPresenter } from '../web-input-number-question.presenter';

export type HotBeveragesKeys = keyof HotBeveragesAnswer;
export type HotBeverageViewModel = QuestionPresenterViewModel<
  QuestionViewModel<QuestionViewModel<MultipleAnswersViewModel<HotBeverageAnswerValue>>>
>;
type HotBeverageAnswerValue = InputAnswer<HotBeveragesKeys>;

@injectable()
export class WebHotBeveragesQuestionPresenter extends WebInputNumberQuestionPresenter<HotBeveragesAnswer, HotBeverageViewModel> {
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
}
