import { MilkTypes } from 'carbon-cut-commons';
import { injectable } from 'inversify';
import { SelectableQuestionViewModel } from '../../../domain/ports/presenters/question.presenter';
import { WebSelectableQuestionPresenter } from './web-selectable-question.presenter';

@injectable()
export class WebMilkTypeQuestionPresenter extends WebSelectableQuestionPresenter<MilkTypes> {
  readonly viewModel: SelectableQuestionViewModel<MilkTypes> = {
    questions: [
      {
        question: 'Quel type de lait buvez-vous habituellement ?',
        answers: [
          { label: 'Lait de vache', value: MilkTypes.cowMilk, selected: false },
          { label: 'Lait de soja', value: MilkTypes.sojaMilk, selected: false },
          { label: "Lait de d'avoine", value: MilkTypes.oatsMilk, selected: false },
        ],
      },
    ],
    selectedAnswer: undefined,
    canSubmit: false,
  };
}
