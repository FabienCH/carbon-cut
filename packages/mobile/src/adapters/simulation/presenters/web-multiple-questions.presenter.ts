import { injectable } from 'inversify';
import { PositiveNumberError } from '../../../domain/entites/answer-validator';
import { NumericAnswerHelper } from '../../../domain/entites/numeric-answer-helper';
import {
  Answer,
  AnswerViewModel,
  InputAnswer,
  InputAnswerValue,
  InputQuestionPresenter,
  MultipleAnswersViewModel,
  MultipleQuestionsViewModel,
  QuestionPresenterViewModel,
  QuestionViewModel,
  SelectableQuestionPresenter,
} from '../../../domain/ports/presenters/question.presenter';

type MultipleQuestionsPresenterViewModel = QuestionPresenterViewModel<
  MultipleQuestionsViewModel<{
    selectableQuestion: QuestionViewModel<MultipleAnswersViewModel<Answer<string>>>;
    inputQuestion: QuestionViewModel<AnswerViewModel<InputAnswer<string>>>;
  }>
>;
type SelectableAnswer<ViewModel extends MultipleQuestionsPresenterViewModel> =
  ViewModel['questions']['selectableQuestion']['answers'][0]['value'];
type InputAnswersValues<ViewModel extends MultipleQuestionsPresenterViewModel> = Record<
  ViewModel['questions']['inputQuestion']['answer']['id'],
  number | undefined
>;

@injectable()
export abstract class WebMultipleQuestionsPresenter<ViewModel extends MultipleQuestionsPresenterViewModel>
  implements
    SelectableQuestionPresenter<SelectableAnswer<ViewModel>, ViewModel>,
    InputQuestionPresenter<InputAnswersValues<ViewModel>, ViewModel>
{
  abstract selectedAnswer: SelectableAnswer<ViewModel>;
  abstract answerValues: InputAnswersValues<ViewModel>;

  protected abstract _viewModel: ViewModel;

  #inputAnswerValid = false;

  get viewModel(): ViewModel {
    return this._viewModel;
  }

  #notifyChanges!: (viewModel: ViewModel) => void;

  setAnswer({ value }: InputAnswerValue<keyof InputAnswersValues<ViewModel>>, error: PositiveNumberError, isValid: boolean): void {
    const updatedInputQuestion = {
      ...this._viewModel.questions.inputQuestion,
      answer: this.#updateAnswer(this._viewModel.questions.inputQuestion.answer, value, error),
    };
    this.#inputAnswerValid = isValid;
    this.#updateViewModel(
      { ...this._viewModel.questions, inputQuestion: updatedInputQuestion },
      this.#inputAnswerValid && !!this.selectedAnswer,
    );
  }

  setSelectedAnswer(answerValue: SelectableAnswer<ViewModel>): void {
    this.selectedAnswer = answerValue;
    this._viewModel = { ...this._viewModel, canSubmit: this.#inputAnswerValid && !!this.selectedAnswer };
    this.#notifyChanges(this._viewModel);
  }

  onViewModelChanges(updateViewFn: (viewModel: ViewModel) => void): void {
    this.#notifyChanges = updateViewFn;
  }

  #updateAnswer<InputKey extends string>(answer: InputAnswer<InputKey>, value: string | undefined, answerError: PositiveNumberError) {
    const errorMessage = answerError ? `Veuillez saisir un nombre${answerError.error === 'isNotPositive' ? ' positif' : ''}` : undefined;
    return { ...answer, value: NumericAnswerHelper.formatValue(value), errorMessage };
  }

  #updateViewModel(questions: Partial<ViewModel['questions']>, canSubmit: boolean) {
    this._viewModel = { ...this._viewModel, questions: { ...this._viewModel.questions, ...questions }, canSubmit: canSubmit };
    this.#notifyChanges(this._viewModel);
  }
}
