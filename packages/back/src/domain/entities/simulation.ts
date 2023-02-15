import { CarbonFootprintDto, SimulationDto } from 'carbon-cut-commons';
import { SimulationData } from '../types/simulation-data';
import { Alimentation } from './alimentation/alimentation';
import { Transport } from './transport/transport';

export class Simulation {
  readonly #alimentation: Alimentation;
  readonly #transport: Transport;

  constructor(simulationDto: SimulationDto, simulationData: SimulationData) {
    const { alimentation, transport } = simulationDto;
    const { alimentationData, transportData } = simulationData;
    this.#alimentation = new Alimentation(alimentation, alimentationData);
    this.#transport = new Transport(transport, transportData);
  }

  calculate(): CarbonFootprintDto {
    const alimentation = this.#alimentation.calculateYearlyFootprint();
    const transport = this.#transport.calculateYearlyFootprint();
    return { alimentation, transport };
  }
}
