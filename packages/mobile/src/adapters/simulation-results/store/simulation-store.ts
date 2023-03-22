import { AnswerToSave, SimulationStore } from '@domain/ports/stores/simulation-store';
import { CarbonFootprint } from '@domain/types/carbon-footprint';
import { SimulationAnswers } from '@domain/types/simulation-answers';
import { navigate, Routes } from '@infrastructure/root-navigation';
import { injectable } from 'inversify';
import { appStore } from '../../commons/store/app-store';
import { saveAnswer, setCarbonFootprint } from './actions/simulation-actions';
import { selectSimulationAnswers } from './selectors/simulation-selectors';

@injectable()
export class ReduxSimulationStore implements SimulationStore {
  setCarbonFootprint(carbonFootprint: CarbonFootprint) {
    appStore.dispatch(setCarbonFootprint(carbonFootprint));
    navigate(Routes.SimulationResults);
  }

  getSimulationsAnswers() {
    return selectSimulationAnswers() as SimulationAnswers;
  }

  saveAnswer(answer: AnswerToSave) {
    appStore.dispatch(saveAnswer({ answer }));
  }
}
