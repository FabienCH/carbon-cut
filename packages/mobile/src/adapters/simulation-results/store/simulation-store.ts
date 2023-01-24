import { CarbonFootprintDto, SimulationDto } from 'carbon-cut-commons';
import { injectable } from 'inversify';
import { SimulationStore } from '../../../domain/ports/stores/simulation-store';
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
    const simulationAnswers = selectSimulationAnswers() as SimulationDto;
    return simulationAnswers;
  }

  saveAnswer(answer: Partial<SimulationDto>) {
    appStore.dispatch(saveAnswer(answer));
  }
}
