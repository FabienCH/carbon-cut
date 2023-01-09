import { injectable } from 'inversify';
import { SimulationStore } from '../../domain/ports/stores/simulation-store';
import { navigate, Routes } from '../root-navigation';
import { setFootprint } from './actions/simulation-actions';
import { appStore } from './app-store';

@injectable()
export class ReduxSimulationStore implements SimulationStore {
  setFootprint(footprint: number) {
    appStore.dispatch(setFootprint(footprint));
    navigate(Routes.SimulationResults);
  }
}
