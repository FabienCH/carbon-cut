import { CarbonFootprintDto, CarSize, FuelType, SimulationDto } from 'carbon-cut-commons';
import { injectable } from 'inversify';
import { AnswerToSave, SimulationStore } from '../../../domain/ports/stores/simulation-store';
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
    const answers = selectSimulationAnswers();
    const transport = answers?.transport
      ? {
          ...answers?.transport,
          car: { ...answers.transport.car, fuelType: FuelType.diesel, fuelConsumption: 6.5, carSize: CarSize.medium },
        }
      : { car: { fuelType: FuelType.diesel, carSize: CarSize.medium } };
    return { ...answers, transport } as SimulationDto;
  }

  saveAnswer(sector: keyof SimulationDto, answer: Partial<AnswerToSave>) {
    appStore.dispatch(saveAnswer({ sector, answer }));
  }
}
