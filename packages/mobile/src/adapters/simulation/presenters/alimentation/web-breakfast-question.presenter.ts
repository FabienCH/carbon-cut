import { BreakfastTypes } from 'carbon-cut-commons';
import { injectable } from 'inversify';
import {
  Answer,
  MultipleAnswersViewModel,
  QuestionPresenterViewModel,
  QuestionViewModel,
} from '../../../../domain/ports/presenters/question.presenter';
import { WebSelectableQuestionPresenter } from '../web-selectable-question.presenter';

export type BreakfastAnswer = Answer<BreakfastTypes>;
export type BreakfastViewModel = QuestionPresenterViewModel<QuestionViewModel<MultipleAnswersViewModel<BreakfastAnswer>>>;

@injectable()
export class WebBreakfastQuestionPresenter extends WebSelectableQuestionPresenter<BreakfastTypes, BreakfastViewModel> {
  protected readonly _viewModel: BreakfastViewModel = {
    question: 'Quel type de petit déjeuner prenez-vous habituellement ?',
    answers: [
      { label: 'Viennoiserie / Pain', value: BreakfastTypes.continentalBreakfast },
      { label: 'Céréales avec lait ou yaourt', value: BreakfastTypes.milkCerealBreakfast },
      { label: 'Salé (britannique)', value: BreakfastTypes.britishBreakfast },
      { label: 'Fruits', value: BreakfastTypes.veganBreakfast },
      { label: 'Pas de petit-déj. (hors boisson)', value: BreakfastTypes.noBreakfast },
    ],
    canSubmit: false,
  };
}
