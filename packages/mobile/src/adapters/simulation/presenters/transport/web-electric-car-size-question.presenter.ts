import { CarSize } from 'carbon-cut-commons';
import { injectable } from 'inversify';
import {
  Answer,
  MultipleAnswersViewModel,
  QuestionPresenterViewModel,
  QuestionViewModel,
} from '../../../../domain/ports/presenters/question.presenter';
import { WebSelectableQuestionPresenter } from '../web-selectable-question.presenter';

export type ElectricCarSizeAnswer = Answer<CarSize>;
export type ElectricCarSizeViewModel = QuestionPresenterViewModel<QuestionViewModel<MultipleAnswersViewModel<ElectricCarSizeAnswer>>>;

@injectable()
export class WebElectricCarSizeQuestionPresenter extends WebSelectableQuestionPresenter<CarSize, ElectricCarSizeViewModel> {
  protected readonly _viewModel: ElectricCarSizeViewModel = {
    question: 'Quel est le gabarit de votre voiture ?',
    answers: [
      { label: 'Petite', value: CarSize.small },
      { label: 'Moyenne', value: CarSize.medium },
      { label: 'Berline', value: CarSize.sedan },
      { label: 'SUV', value: CarSize.SUV },
    ],
    canSubmit: false,
  };
}
