import { BreakfastTypes } from 'carbon-cut-commons';
import { injectable } from 'inversify';
import { QuestionPresenter, QuestionViewModel } from '../../domain/ports/presenters/question.presenter';

@injectable()
export class WebBreakfastQuestionPresenter implements QuestionPresenter<BreakfastTypes> {
  readonly viewModel: QuestionViewModel<BreakfastTypes> = {
    question: 'Quel type de petit déjeuner prenez-vous habituellement ?',
    answers: [
      { label: 'Viennoiserie / Pain', value: BreakfastTypes.continentalBreakfast, selected: false },
      { label: 'Céréales avec lait ou yaourt', value: BreakfastTypes.cowMilkCerealBreakfast, selected: false },
      { label: 'Salé (britannique)', value: BreakfastTypes.britishBreakfast, selected: false },
      { label: 'Fruits', value: BreakfastTypes.veganBreakfast, selected: false },
      { label: 'Pas de petit-déj. (hors boisson)', value: BreakfastTypes.noBreakfast, selected: false },
    ],
    selectedAnswer: undefined,
    canSubmit: false,
  };

  setSelectedAnswer(breakfast: BreakfastTypes): void {
    this.viewModel.selectedAnswer = breakfast;
    this.viewModel.canSubmit = !!this.viewModel.selectedAnswer;
    this.viewModel.answers = this.viewModel.answers.map((answer) => ({ ...answer, selected: breakfast === answer.value }));
  }
}
