import { injectable } from 'inversify';
import { PositiveNumberError } from '../../../domain/entites/answer-validator';
import { NumericAnswerHelper } from '../../../domain/entites/numeric-answer-helper';
import {
  DefaultQuestionPresenterViewModel,
  InputAnswer,
  InputAnswerValue,
  InputQuestionPresenter,
} from '../../../domain/ports/presenters/question.presenter';

@injectable()
export abstract class WebInputNumberQuestionPresenter<
  AnswerValues extends Record<string, number | undefined>,
  ViewModel extends DefaultQuestionPresenterViewModel,
> implements InputQuestionPresenter<AnswerValues, ViewModel>
{
  abstract setAnswer(
    answerValue: InputAnswerValue<keyof AnswerValues>,
    error: PositiveNumberError,
    canSubmit: boolean,
    questionIndex?: number | undefined,
  ): void;

  protected abstract _viewModel: ViewModel;

  abstract answerValues: AnswerValues;

  get viewModel(): ViewModel {
    return this._viewModel;
  }

  #notifyChanges!: (viewModel: ViewModel) => void;

  onViewModelChanges(updateViewFn: (viewModel: ViewModel) => void): void {
    this.#notifyChanges = updateViewFn;
  }

  protected updateViewModel(viewModel: Partial<ViewModel>) {
    this._viewModel = { ...this._viewModel, ...viewModel };
    this.#notifyChanges(this._viewModel);
  }

  protected updateAnswer<InputKey extends string>(
    answer: InputAnswer<InputKey>,
    value: string | undefined,
    answerError: PositiveNumberError,
  ) {
    const errorMessage = answerError ? `Veuillez saisir un nombre${answerError.error === 'isNotPositive' ? ' positif' : ''}` : undefined;

    return { ...answer, value: NumericAnswerHelper.formatValue(value), errorMessage };
  }
}
