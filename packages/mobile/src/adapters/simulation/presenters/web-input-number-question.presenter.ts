import { injectable } from 'inversify';
import { Answer, QuestionPresenter, QuestionViewModel } from '../../../domain/ports/presenters/question.presenter';

@injectable()
export abstract class WebInputNumberQuestionPresenter<AnswersType> implements QuestionPresenter<string> {
  readonly viewModel!: QuestionViewModel<string, string>;

  setAnswer({ key, value }: { key: string; value: string }, questionIndex = 0): void {
    this.viewModel.questions = this.viewModel.questions.map((question, idx) => {
      if (idx === questionIndex) {
        return {
          ...question,
          answers: this.#updatedAnswers(question.answers, key, value),
        };
      }
      return question;
    });
    this.viewModel.canSubmit = this.viewModel.questions.every((question) =>
      question.answers.every((answer) => answer.value && !isNaN(parseFloat(answer.value))),
    );
  }

  abstract getAnswers(): AnswersType;

  protected valueToNumber(value: string | null): number {
    return parseFloat(value ?? '0');
  }

  #updatedAnswers(answers: Answer<string, string | null>[], key: string, value: string): Answer<string, string | null>[] {
    const commaReplacedValue = value?.replace(',', '.');
    const isPositiveNumber = commaReplacedValue?.match(/^[0-9]+.?[0-9]*$/);

    return answers.map((answer) => (answer.id === key ? this.#updateAnswer(answer, commaReplacedValue, !!isPositiveNumber) : answer));
  }

  #updateAnswer(answer: Answer<string, string | null>, value: string, isPositiveNumber: boolean) {
    const errorMessage = isPositiveNumber ? undefined : `Veuillez saisir un nombre${isNaN(parseFloat(value)) ? '' : ' positif'}`;

    return { ...answer, value, errorMessage };
  }
}
