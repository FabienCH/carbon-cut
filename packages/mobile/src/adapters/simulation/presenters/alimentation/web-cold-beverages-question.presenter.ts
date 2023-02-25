import { ColdBeveragesAnswer } from 'carbon-cut-commons';
import { injectable } from 'inversify';
import { PositiveNumberError } from '../../../../domain/entites/answer-validator';
import {
  AnswerViewModel,
  InputAnswer,
  InputAnswerValue,
  MultipleQuestionsViewModel,
  QuestionPresenterViewModel,
  QuestionViewModel,
} from '../../../../domain/ports/presenters/question.presenter';
import { WebInputNumberQuestionPresenter } from '../web-input-number-question.presenter';

export type ColdBeveragesKeys = keyof ColdBeveragesAnswer;
export type ColdBeveragesViewModel = QuestionPresenterViewModel<
  MultipleQuestionsViewModel<QuestionViewModel<AnswerViewModel<ColdBeverageAnswerValue>>>
>;
type ColdBeverageAnswerValue = InputAnswer<ColdBeveragesKeys>;

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
        answer: { id: 'sweet', label: '', placeholder: 'litres / semaine', value: undefined },
      },
      {
        question: "Quelle est votre consommation d'alcool par semaine (vin, bière, cocktail) ?",
        answer: { id: 'alcohol', label: '', placeholder: 'litres / semaine', value: undefined },
      },
    ],
    canSubmit: false,
  };

  setAnswer({ value }: InputAnswerValue<ColdBeveragesKeys>, error: PositiveNumberError, canSubmit: boolean, questionIndex: number): void {
    const questions = this._viewModel.questions.map((question, idx) => {
      if (idx === questionIndex) {
        const updatedAnswer = this.updateAnswer(question.answer, value, error);
        return { ...question, answer: updatedAnswer };
      }
      return question;
    });
    this.updateViewModel({ questions, canSubmit });
  }
}
