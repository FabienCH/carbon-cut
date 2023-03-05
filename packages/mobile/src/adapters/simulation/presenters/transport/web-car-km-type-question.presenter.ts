import { EngineType } from 'carbon-cut-commons';
import { injectable } from 'inversify';
import { NumericAnswerHelper } from '../../../../domain/entites/numeric-answer-helper';
import { ConditionalNextQuestion } from '../../../../domain/ports/presenters/conditionnal-next-question';
import {
  Answer,
  AnswerViewModel,
  InputAnswer,
  MultipleAnswersViewModel,
  MultipleQuestionsViewModel,
  QuestionPresenterViewModel,
  QuestionViewModel,
} from '../../../../domain/ports/presenters/question.presenter';
import { Routes } from '../../../../infrastructure/root-navigation';
import { WebMultipleQuestionsPresenter } from '../web-multiple-questions.presenter';

export type CarKmTypeAnswerViewModel = QuestionPresenterViewModel<
  MultipleQuestionsViewModel<{
    selectableQuestion: QuestionViewModel<MultipleAnswersViewModel<Answer<EngineType>>>;
    inputQuestion: QuestionViewModel<AnswerViewModel<InputAnswer<'km'>>>;
  }>
>;

@injectable()
export class WebCarKmTypeQuestionPresenter
  extends WebMultipleQuestionsPresenter<CarKmTypeAnswerViewModel>
  implements ConditionalNextQuestion
{
  selectedAnswer!: EngineType;

  get viewModel(): CarKmTypeAnswerViewModel {
    return this._viewModel;
  }

  get answerValues(): { km: number } {
    return { km: NumericAnswerHelper.valueToNumber(this._viewModel.questions.inputQuestion.answer.value) as number };
  }

  protected _viewModel: CarKmTypeAnswerViewModel = {
    questions: {
      selectableQuestion: {
        question: 'Quel est le type de motorisation de votre voiture ?',
        answers: [
          { label: 'Thermique (diesel/essence)', value: EngineType.thermal },
          { label: 'Hybride', value: EngineType.hybrid },
          { label: 'Electrique', value: EngineType.electric },
        ],
      },
      inputQuestion: {
        question: "Combien de km parcourez-vous dans l'année ?",
        answer: { id: 'km', label: '', placeholder: 'km / an', value: undefined },
      },
    },
    canSubmit: false,
  };

  getNextQuestion(): Routes {
    return this.selectedAnswer === EngineType.electric ? Routes.ElectricCarSize : Routes.FuelCarConsumption;
  }
}
