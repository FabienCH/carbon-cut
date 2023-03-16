import { CarbonFootprint } from '@domain/types/carbon-footprint';
import { SimulationAnswers } from '@domain/types/simulation-answers';
import { NumberFormatter } from 'carbon-cut-commons';
import { SimulationData } from '../types/simulation-data';
import { Alimentation } from './alimentation/alimentation';
import { Transport } from './transport/transport';

export class Simulation {
  readonly #alimentation: Alimentation;
  readonly #transport: Transport;

  constructor(simulationAnswers: SimulationAnswers, simulationData: SimulationData) {
    const { alimentation, transport } = simulationAnswers;
    const { alimentationData, transportData } = simulationData;
    this.#alimentation = new Alimentation(alimentation, alimentationData);
    this.#transport = new Transport(transport, transportData);
  }

  calculate(): CarbonFootprint {
    const alimentation = this.#alimentation.calculateYearlyFootprint();
    const transport = this.#transport.calculateYearlyFootprint();
    const total = NumberFormatter.roundNumber(alimentation.total + transport.total, 3);
    return { alimentation, transport, total };
  }
}
