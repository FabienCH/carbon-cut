import { ColdBeveragesAnswer } from 'carbon-cut-commons';
import { injectable } from 'inversify';
import { Answer, QuestionPresenter, QuestionViewModel } from '../../domain/ports/presenters/question.presenter';

export type ColdBeveragesKeys = keyof ColdBeveragesAnswer;

@injectable()
export class WebColdBeveragesQuestionPresenter implements QuestionPresenter<number | string> {
  readonly viewModel: QuestionViewModel<ColdBeveragesKeys, number> = {
    questions: [
      {
        question: 'Quelle est votre consommation de boissons sucrée par semaine (sodas, jus de fruit, sirops)?',
        answers: [{ id: 'sweet', label: '', placeholder: 'litres / semaine', value: null }],
      },
    ],

    canSubmit: false,
  };

  setAnswer({ key, value }: { key: ColdBeveragesKeys; value: string }, questionIndex: number): void {
    const isPositiveNumber = value?.match(/^[0-9]+.?[0-9]*$/);
    const intValue = parseFloat(value);
    this.viewModel.questions = this.viewModel.questions.map((question, idx) => {
      if (idx === questionIndex) {
        return {
          ...question,
          answers: question.answers.map((answer) =>
            answer.id === key ? this.#updateAnswer(answer, intValue, !!isPositiveNumber) : answer,
          ),
        };
      }
      return question;
    });
    this.viewModel.canSubmit = this.viewModel.questions[questionIndex].answers.every((answer) => answer.value !== null);

    console.log('this.viewModel.questions', this.viewModel.questions);
    console.log('this.viewModel.canSubmit', this.viewModel.canSubmit);
  }

<<<<<<< Updated upstream
  simulationBeverages(): ColdBeveragesAnswer {
    return this.viewModel.answers.reduce((coldBeverages, answer) => {
=======
  simulationBeverages(): ColdBeverages {
    return this.viewModel.questions.reduce((coldBeverages, question) => {
      const answer = question.answers[0];
>>>>>>> Stashed changes
      coldBeverages = { ...coldBeverages, [answer.id]: answer.value as number };
      return coldBeverages;
    }, {} as ColdBeveragesAnswer);
  }

  #updateAnswer(answer: Answer<ColdBeveragesKeys, number | null>, value: number, isPositiveNumber: boolean) {
    const updatedAnswer = isPositiveNumber
      ? { value, errorMessage: undefined }
      : { value: null, errorMessage: `Veuillez saisir un nombre${isNaN(value) ? '' : ' positif'}` };

    return { ...answer, ...updatedAnswer };
  }
}
