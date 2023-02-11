import { CarbonFootprintDto, SimulationDto } from 'carbon-cut-commons';
import { AlimentationData } from '../types/alimentation-types';
import { Alimentation } from './alimentation/alimentation';

export class Simulation {
  readonly #alimentation: Alimentation;

  constructor(simulationDto: SimulationDto, alimentationData: AlimentationData) {
    const { alimentation } = simulationDto;
    this.#alimentation = new Alimentation(alimentation, alimentationData);
  }

  calculate(): CarbonFootprintDto {
    const alimentation = this.#alimentation.calculateYearlyFootprint();

    return { alimentation };
  }
}
