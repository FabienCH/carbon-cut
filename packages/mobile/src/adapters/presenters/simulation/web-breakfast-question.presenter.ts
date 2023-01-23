import { BreakfastTypes } from 'carbon-cut-commons';
import { injectable } from 'inversify';
import { SelectableQuestionViewModel } from '../../../domain/ports/presenters/question.presenter';
import { WebSelectableQuestionPresenter } from './web-selectable-question.presenter';

@injectable()
export class WebBreakfastQuestionPresenter extends WebSelectableQuestionPresenter<BreakfastTypes> {
  readonly viewModel: SelectableQuestionViewModel<BreakfastTypes> = {
    questions: [
      {
        question: 'Quel type de petit déjeuner prenez-vous habituellement ?',
        answers: [
          { label: 'Viennoiserie / Pain', value: BreakfastTypes.continentalBreakfast, selected: false },
          { label: 'Céréales avec lait ou yaourt', value: BreakfastTypes.milkCerealBreakfast, selected: false },
          { label: 'Salé (britannique)', value: BreakfastTypes.britishBreakfast, selected: false },
          { label: 'Fruits', value: BreakfastTypes.veganBreakfast, selected: false },
          { label: 'Pas de petit-déj. (hors boisson)', value: BreakfastTypes.noBreakfast, selected: false },
        ],
      },
    ],
    selectedAnswer: undefined,
    canSubmit: false,
  };
}
