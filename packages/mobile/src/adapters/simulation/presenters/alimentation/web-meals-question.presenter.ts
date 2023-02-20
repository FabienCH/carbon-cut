import { MealsAnswer } from 'carbon-cut-commons';
import { injectable } from 'inversify';
import { NumberEqualError, PositiveNumberError } from '../../../../domain/entites/answer-validator';
import {
  InputAnswer,
  InputAnswerValue,
  MultipleAnswersViewModel,
  QuestionPresenterViewModel,
  QuestionViewModel,
  WithFormValidation,
} from '../../../../domain/ports/presenters/question.presenter';
import { WebInputNumberQuestionPresenter } from '../web-input-number-question.presenter';

export type MealsKeys = keyof MealsAnswer;
export type MealViewModel = QuestionPresenterViewModel<
  QuestionViewModel<MultipleAnswersViewModel<MealAnswerValue>> & { formError: string | null }
>;
type MealAnswerValue = InputAnswer<MealsKeys>;

@injectable()
export class WebMealsQuestionPresenter
  extends WebInputNumberQuestionPresenter<MealsAnswer, MealViewModel>
  implements WithFormValidation<MealViewModel>
{
  get answerValues(): MealsAnswer {
    return this._viewModel.answers.reduce((meals, answer) => {
      meals = { ...meals, [answer.id]: this.valueToNumber(answer.value) };
      return meals;
    }, {} as MealsAnswer);
  }

  protected readonly _viewModel: MealViewModel = {
    question: 'Quels sont les types de repas que vous prenez sur une semaine (déjeuner et diner) ?',
    answers: [
      { id: 'vegan', label: 'Végétalien (sans produits animaux)', placeholder: 'Repas végétaliens / semaine', value: undefined },
      {
        id: 'vegetarian',
        label: 'Végétarien (avec œufs ou fromage par ex.)',
        placeholder: 'Repas végétariens / semaine',
        value: undefined,
      },
      { id: 'whiteMeat', label: 'Viande blanche (poulet, proc)', placeholder: 'Repas viande blanche / semaine', value: undefined },
      { id: 'redMeat', label: 'Viande rouge (bœuf, veau, agneau)', placeholder: 'Repas viande rouge / semaine', value: undefined },
      { id: 'whiteFish', label: 'Poisson blanc', placeholder: 'Repas poisson blanc / semaine', value: undefined },
      { id: 'fish', label: 'Autres poissons (thon, saumon, sardine...)', placeholder: 'Repas autres poissons / semaine', value: undefined },
    ],
    canSubmit: false,
    formError: null,
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

  updateFormError(formError: NumberEqualError): void {
    const previousFormError = this._viewModel.formError;
    const formErrorMessage =
      formError?.error === 'isNotEqual' ? `Le nombre de repas pour une semaine doit être de ${formError.expected}` : undefined;
    if (formErrorMessage !== previousFormError) {
      this.updateViewModel({ formError: formErrorMessage });
    }
  }
}
