import { CarbonFootprintDto } from 'carbon-cut-commons';
import { injectable } from 'inversify';
import { SimulationStore } from '../../domain/ports/stores/simulation-store';
import { navigate, Routes } from '../root-navigation';
import { setCarbonFootprint } from './actions/simulation-actions';
import { appStore } from './app-store';

@injectable()
export class ReduxSimulationStore implements SimulationStore {
  setCarbonFootprint(carbonFootprint: CarbonFootprintDto) {
    appStore.dispatch(setCarbonFootprint(carbonFootprint));
    navigate(Routes.SimulationResults);
  }
}
