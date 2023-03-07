import { CarbonFootprintDto, SimulationDto } from 'carbon-cut-commons';
import { injectable } from 'inversify';
import { AnswerKey, AnswerValues, SimulationStore } from '../../../domain/ports/stores/simulation-store';
import { navigate, Routes } from '../../../infrastructure/root-navigation';
import { appStore } from '../../commons/store/app-store';
import { saveAnswer, setCarbonFootprint } from './actions/simulation-actions';
import { selectSimulationAnswers } from './selectors/simulation-selectors';

@injectable()
export class ReduxSimulationStore implements SimulationStore {
  setCarbonFootprint(carbonFootprint: CarbonFootprintDto) {
    appStore.dispatch(setCarbonFootprint(carbonFootprint));
    navigate(Routes.SimulationResults);
  }

  getSimulationsAnswers() {
    return selectSimulationAnswers() as SimulationDto;
  }

  saveAnswer(sector: keyof SimulationDto, answerKey: AnswerKey, answers: AnswerValues) {
    appStore.dispatch(saveAnswer({ sector, answerKey, answers }));
  }
}
