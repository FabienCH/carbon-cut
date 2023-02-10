import { MealsAnswer } from 'carbon-cut-commons';
import { injectable } from 'inversify';
import { PositiveNumberError } from '../../../domain/entites/answer-validator';
import {
  InputAnswer,
  InputAnswerValue,
  MultipleAnswersViewModel,
  QuestionPresenterViewModel,
  QuestionViewModel,
} from '../../../domain/ports/presenters/question.presenter';
import { WebInputNumberQuestionPresenter } from './web-input-number-question.presenter';

export type MealsKeys = keyof MealsAnswer;
export type MealViewModel = QuestionPresenterViewModel<QuestionViewModel<QuestionViewModel<MultipleAnswersViewModel<MealAnswerValue[]>>>>;
type MealAnswerValue = InputAnswer<MealsKeys>;

@injectable()
export class WebMealsQuestionPresenter extends WebInputNumberQuestionPresenter<MealsAnswer, MealViewModel> {
  get answerValues(): MealsAnswer {
    return this._viewModel.answers.reduce((hotBeverages, answer) => {
      hotBeverages = { ...hotBeverages, [answer.id]: this.valueToNumber(answer.value) };
      return hotBeverages;
    }, {} as MealsAnswer);
  }

  protected readonly _viewModel: MealViewModel = {
    question: 'Quels sont les types de repas que vous prenez sur une semaine (déjeuner et diner) ?',
    answers: [
      { id: 'vegan', label: 'Végétalien (sans produits animaux)', placeholder: 'Repas végétalien / semaine', value: undefined },
      {
        id: 'vegetarian',
        label: 'Végétarien (avec œufs ou fromage par ex.)',
        placeholder: 'Repas végétarien / semaine',
        value: undefined,
      },
      { id: 'whiteMeat', label: 'Viande blanche (poulet, proc)', placeholder: 'Repas viande blanche / semaine', value: undefined },
      { id: 'redMeat', label: 'Viande rouge (bœuf, veau, agneau)', placeholder: 'Repas viande rouge / semaine', value: undefined },
      { id: 'whiteFish', label: 'Poisson blanc', placeholder: 'Repas poisson blanc / semaine', value: undefined },
      { id: 'fish', label: 'Autres poissons (thon, saumon, sardine...)', placeholder: 'Repas autres poissons / semaine', value: undefined },
    ],
    canSubmit: false,
  };

  setAnswer({ id, value }: InputAnswerValue<MealsKeys>, error: PositiveNumberError, canSubmit: boolean): void {
    const answers = this._viewModel.answers.map((answer) => {
      if (answer.id === id) {
        return this.updateAnswer(answer, value, error);
      }

      return answer;
    });

    this.updateViewModel({ answers, canSubmit });
  }
}
