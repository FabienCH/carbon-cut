import { MilkTypes } from 'carbon-cut-commons';
import { injectable } from 'inversify';
import { QuestionPresenter, SelectableQuestionViewModel } from '../../domain/ports/presenters/question.presenter';

@injectable()
export class WebMilkTypeQuestionPresenter implements QuestionPresenter<MilkTypes> {
  readonly viewModel: SelectableQuestionViewModel<MilkTypes> = {
    question: 'Quel type de lait buvez-vous habituellement ?',
    answers: [
      { label: 'Lait de vache', value: MilkTypes.cowMilk, selected: false },
      { label: 'Lait de soja', value: MilkTypes.sojaMilk, selected: false },
      { label: "Lait de d'avoine", value: MilkTypes.oatsMilk, selected: false },
    ],
    selectedAnswer: undefined,
    canSubmit: false,
  };

  setAnswer(milkType: MilkTypes): void {
    this.viewModel.selectedAnswer = milkType;
    this.viewModel.canSubmit = !!this.viewModel.selectedAnswer;
    this.viewModel.answers = this.viewModel.answers.map((answer) => ({ ...answer, selected: milkType === answer.value }));
  }
}
