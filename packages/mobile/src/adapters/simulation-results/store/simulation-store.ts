import { QuestionIds } from '@domain/entites/questions-navigation';
import { AnswerToSave, SimulationStore } from '@domain/ports/stores/simulation-store';
import { CarbonFootprint } from '@domain/types/carbon-footprint';
import { SimulationAnswers } from '@domain/types/simulation-answers';
import { AllRoutes, navigate } from '@infrastructure/root-navigation';
import { injectable } from 'inversify';
import { appStore } from '../../commons/store/app-store';
import { saveAnswer, setCarbonFootprint, setCurrentQuestion } from './actions/simulation-actions';
import { selectCurrentQuestionId, selectSimulationAnswers } from './selectors/simulation-selectors';

@injectable()
export class ReduxSimulationStore implements SimulationStore {
  setCarbonFootprint(carbonFootprint: CarbonFootprint) {
    appStore.dispatch(setCarbonFootprint(carbonFootprint));
    navigate(AllRoutes.SimulationResults);
  }

  setCurrentQuestion(questionId: QuestionIds) {
    appStore.dispatch(setCurrentQuestion(questionId));
  }

  getCurrentQuestion(): QuestionIds {
    return selectCurrentQuestionId();
  }

  getSimulationsAnswers() {
    return selectSimulationAnswers() as SimulationAnswers;
  }

  saveAnswer(answer: AnswerToSave) {
    appStore.dispatch(saveAnswer({ answer }));
  }
}
