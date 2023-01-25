import { injectable } from 'inversify';
import {
  ExclusiveUnion,
  InputAnswer,
  InputQuestionPresenter,
  QuestionPresenterViewModel,
} from '../../../domain/ports/presenters/question.presenter';

@injectable()
export abstract class WebInputNumberQuestionPresenter<AnswerValues, ViewModel extends QuestionPresenterViewModel>
  implements InputQuestionPresenter<string, AnswerValues>
{
  abstract setAnswer<InputKey extends string>(
    answerValue: ExclusiveUnion<string | null, { key: InputKey; value: string | null }>,
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

  protected updateAnswer<InputKey extends string>(answer: InputAnswer<InputKey, string | null>, value: string | null) {
    const commaReplacedValue = value?.replace(',', '.') ?? null;
    const isPositiveNumber = commaReplacedValue?.match(/^[0-9]+.?[0-9]*$/);
    const errorMessage = isPositiveNumber ? undefined : `Veuillez saisir un nombre${isNaN(parseFloat(value ?? '')) ? '' : ' positif'}`;

    return { ...answer, value: commaReplacedValue, errorMessage };
  }

  protected formatValue(value: string | null): string | null {
    return value?.replace(',', '.') ?? null;
  }

  protected valueToNumber(value: string | null): number {
    return parseFloat(value ?? '0');
  }

  protected isPositiveNumber(value: string | null): boolean {
    return !!value?.match(/^[0-9]+.?[0-9]*$/);
  }
}
