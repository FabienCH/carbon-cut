import { injectable } from 'inversify';
import { Answer, QuestionPresenter, QuestionViewModel } from '../../../domain/ports/presenters/question.presenter';

@injectable()
export abstract class WebInputNumberQuestionPresenter<AnswersType> implements QuestionPresenter<string> {
  readonly viewModel!: QuestionViewModel<string, string>;

  setAnswer({ key, value }: { key: string; value: string }, questionIndex = 0): void {
    const isPositiveNumber = value?.match(/^[0-9]+.?[0-9]*$/);
    this.viewModel.questions = this.viewModel.questions.map((question, idx) => {
      if (idx === questionIndex) {
        return {
          ...question,
          answers: question.answers.map((answer) => (answer.id === key ? this.#updateAnswer(answer, value, !!isPositiveNumber) : answer)),
        };
      }
      return question;
    });
    this.viewModel.canSubmit = this.viewModel.questions[questionIndex].answers.every((answer) => answer.value !== null);
  }

  abstract getAnswers(): AnswersType;

  protected valueToNumber(value: string | null): number {
    return parseFloat(value ?? '0');
  }

  #updateAnswer(answer: Answer<string, string | null>, value: string, isPositiveNumber: boolean) {
    const updatedAnswer = isPositiveNumber
      ? { value, errorMessage: undefined }
      : { value: null, errorMessage: `Veuillez saisir un nombre${isNaN(parseFloat(value)) ? '' : ' positif'}` };

    return { ...answer, ...updatedAnswer };
  }
}
