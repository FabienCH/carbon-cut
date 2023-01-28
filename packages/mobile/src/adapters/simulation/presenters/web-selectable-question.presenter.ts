import { injectable } from 'inversify';
import { QuestionPresenterViewModel, SelectableQuestionPresenter } from '../../../domain/ports/presenters/question.presenter';

@injectable()
export abstract class WebSelectableQuestionPresenter<AnswerType extends string, ViewModel extends QuestionPresenterViewModel>
  implements SelectableQuestionPresenter<AnswerType>
{
  protected abstract _viewModel: ViewModel;

  selectedAnswer: AnswerType | undefined;

  protected notifyChanges!: (viewModel: ViewModel) => void;

  get viewModel(): ViewModel {
    return this._viewModel;
  }

  onViewModelChanges(updateViewFn: (viewModel: ViewModel) => void): void {
    this.notifyChanges = updateViewFn;
  }

  setAnswer(answerValue: AnswerType): void {
    this.selectedAnswer = answerValue;
    this._viewModel = { ...this._viewModel, canSubmit: !!this.selectedAnswer };
    this.notifyChanges(this._viewModel);
  }
}
