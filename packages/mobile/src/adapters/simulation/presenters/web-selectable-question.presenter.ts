import { injectable } from 'inversify';
import { QuestionPresenter, SelectableQuestionViewModel } from '../../../domain/ports/presenters/question.presenter';

@injectable()
export abstract class WebSelectableQuestionPresenter<AnswerType extends string> implements QuestionPresenter<AnswerType> {
  readonly viewModel!: SelectableQuestionViewModel<AnswerType>;

  setAnswer(answerValue: AnswerType): void {
    this.viewModel.selectedAnswer = answerValue;
    this.viewModel.canSubmit = !!this.viewModel.selectedAnswer;
    this.viewModel.questions[0].answers = this.viewModel.questions[0].answers.map((answer) => ({
      ...answer,
      selected: answerValue === answer.value,
    }));
  }
}
