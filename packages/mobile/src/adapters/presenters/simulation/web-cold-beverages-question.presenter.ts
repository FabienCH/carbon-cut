import { ColdBeveragesAnswer } from 'carbon-cut-commons';
import { injectable } from 'inversify';
import { QuestionViewModel } from '../../../domain/ports/presenters/question.presenter';
import { WebInputNumberQuestionPresenter } from './web-input-number-question.presenter';

export type ColdBeveragesKeys = keyof ColdBeveragesAnswer;

@injectable()
export class WebColdBeveragesQuestionPresenter extends WebInputNumberQuestionPresenter<ColdBeveragesAnswer> {
  readonly viewModel: QuestionViewModel<ColdBeveragesKeys, string> = {
    questions: [
      {
        question: 'Quelle est votre consommation de boissons sucrée par semaine (sodas, jus de fruit, sirops) ?',
        answers: [{ id: 'sweet', label: '', placeholder: 'litres / semaine', value: null }],
      },
      {
        question: "Quelle est votre consommation d'alcool par semaine (vin, bière, cocktail) ?",
        answers: [{ id: 'alcohol', label: '', placeholder: 'litres / semaine', value: null }],
      },
    ],
    canSubmit: false,
  };

  getAnswers(): ColdBeveragesAnswer {
    return this.viewModel.questions.reduce((coldBeverages, question) => {
      const answer = question.answers[0];
      coldBeverages = { ...coldBeverages, [answer.id]: this.valueToNumber(answer.value) };
      return coldBeverages;
    }, {} as ColdBeveragesAnswer);
  }
}
