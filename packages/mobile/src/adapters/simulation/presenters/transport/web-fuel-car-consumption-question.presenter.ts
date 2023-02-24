import { FuelType } from 'carbon-cut-commons';
import { injectable } from 'inversify';
import {
  Answer,
  AnswerViewModel,
  InputAnswer,
  MultipleAnswersViewModel,
  MultipleQuestionsViewModel,
  QuestionPresenterViewModel,
  QuestionViewModel,
} from '../../../../domain/ports/presenters/question.presenter';
import { WebMultipleQuestionsPresenter } from '../web-multiple-questions.presenter';

export type FuelCarConsumptionAnswerViewModel = QuestionPresenterViewModel<
  MultipleQuestionsViewModel<{
    selectableQuestion: QuestionViewModel<MultipleAnswersViewModel<Answer<FuelType>>>;
    inputQuestion: QuestionViewModel<AnswerViewModel<InputAnswer<'fuelConsumption'>>>;
  }>
>;

@injectable()
export class WebFuelCarConsumptionQuestionPresenter extends WebMultipleQuestionsPresenter<FuelCarConsumptionAnswerViewModel> {
  selectedAnswer!: FuelType;

  get answerValues(): { fuelConsumption: number } {
    return { fuelConsumption: this.valueToNumber(this._viewModel.questions.inputQuestion.answer.value) as number };
  }

  protected _viewModel: FuelCarConsumptionAnswerViewModel = {
    questions: {
      selectableQuestion: {
        question: 'Quel type de carburant votre voiture consomme-t-elle ?',
        answers: [
          { label: 'Diesel', value: FuelType.diesel },
          { label: 'Essence E10', value: FuelType.essenceE10 },
          { label: 'Essence E85', value: FuelType.essenceE85 },
        ],
      },
      inputQuestion: {
        question: 'Combien de litre votre voiture consomme-t-elle pour 100 km ?',
        answer: { id: 'fuelConsumption', label: '', placeholder: 'l / 100 km', value: undefined },
      },
    },
    canSubmit: false,
  };
}
