import { ColdBeveragesAnswer } from 'carbon-cut-commons';
import { injectable } from 'inversify';
import {
  AnswerViewModel,
  InputAnswer,
  MultipleQuestionsViewModel,
  QuestionPresenterViewModel,
  QuestionViewModel,
} from '../../../domain/ports/presenters/question.presenter';
import { WebInputNumberQuestionPresenter } from './web-input-number-question.presenter';

export type ColdBeveragesKeys = keyof ColdBeveragesAnswer;
export type ColdBeveragesViewModel = QuestionPresenterViewModel<
  MultipleQuestionsViewModel<QuestionViewModel<AnswerViewModel<ColdBeverageAnswerValue>>>
>;
type ColdBeverageAnswerValue = InputAnswer<ColdBeveragesKeys, string | null>;

@injectable()
export class WebColdBeveragesQuestionPresenter extends WebInputNumberQuestionPresenter<ColdBeveragesAnswer, ColdBeveragesViewModel> {
  get answerValues(): ColdBeveragesAnswer {
    return this._viewModel.questions.reduce((coldBeverages, question) => {
      const answer = question.answer;
      coldBeverages = { ...coldBeverages, [answer.id]: this.valueToNumber(answer.value) };
      return coldBeverages;
    }, {} as ColdBeveragesAnswer);
  }

  protected readonly _viewModel: ColdBeveragesViewModel = {
    questions: [
      {
        question: 'Quelle est votre consommation de boissons sucrée par semaine (sodas, jus de fruit, sirops) ?',
        answer: { id: 'sweet', label: '', placeholder: 'litres / semaine', value: null },
      },
      {
        question: "Quelle est votre consommation d'alcool par semaine (vin, bière, cocktail) ?",
        answer: { id: 'alcohol', label: '', placeholder: 'litres / semaine', value: null },
      },
    ],
    canSubmit: false,
  };

  setAnswer(answerValue: string | null, questionIndex: number): void {
    const questions = this._viewModel.questions.map((question, idx) => {
      if (idx === questionIndex) {
        const updatedAnswer = this.updateAnswer(question.answer, answerValue);
        return { ...question, answer: updatedAnswer };
      }
      return question;
    });
    const canSubmit = questions.every((question) => question.answer.value && !isNaN(parseFloat(question.answer.value)));
    this.updateViewModel({ questions, canSubmit });
  }
}
