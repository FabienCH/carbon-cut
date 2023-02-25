import { MilkTypes } from 'carbon-cut-commons';
import { injectable } from 'inversify';
import {
  Answer,
  MultipleAnswersViewModel,
  QuestionPresenterViewModel,
  QuestionViewModel,
} from '../../../../domain/ports/presenters/question.presenter';
import { WebSelectableQuestionPresenter } from '../web-selectable-question.presenter';

export type MilkTypeAnswer = Answer<MilkTypes>;
export type MilkTypeViewModel = QuestionPresenterViewModel<QuestionViewModel<MultipleAnswersViewModel<MilkTypeAnswer>>>;

@injectable()
export class WebMilkTypeQuestionPresenter extends WebSelectableQuestionPresenter<MilkTypes, MilkTypeViewModel> {
  protected readonly _viewModel: MilkTypeViewModel = {
    question: 'Quel type de lait buvez-vous habituellement ?',
    answers: [
      { label: 'Lait de vache', value: MilkTypes.cowMilk },
      { label: 'Lait de soja', value: MilkTypes.sojaMilk },
      { label: "Lait de d'avoine", value: MilkTypes.oatsMilk },
    ],
    canSubmit: false,
  };
}
