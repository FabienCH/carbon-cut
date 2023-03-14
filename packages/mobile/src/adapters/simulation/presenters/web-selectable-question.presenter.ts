import { DefaultQuestionPresenterViewModel, SelectableQuestionPresenter } from '@domain/ports/presenters/question.presenter';
import { injectable } from 'inversify';

@injectable()
export abstract class WebSelectableQuestionPresenter<AnswerType extends string, ViewModel extends DefaultQuestionPresenterViewModel>
  implements SelectableQuestionPresenter<AnswerType, ViewModel>
{
  protected abstract _viewModel: ViewModel;

  selectedAnswer: AnswerType | undefined;

  #notifyChanges!: (viewModel: ViewModel) => void;

  get viewModel(): ViewModel {
    return this._viewModel;
  }

  onViewModelChanges(updateViewFn: (viewModel: ViewModel) => void): void {
    this.#notifyChanges = updateViewFn;
  }

  setSelectedAnswer(answerValue: AnswerType): void {
    this.selectedAnswer = answerValue;
    this._viewModel = { ...this._viewModel, canSubmit: !!this.selectedAnswer };
    this.#notifyChanges(this._viewModel);
  }
}
