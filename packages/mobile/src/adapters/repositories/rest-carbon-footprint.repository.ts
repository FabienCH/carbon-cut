import axios from 'axios';
import { SimulationDto } from 'carbon-cut-types';
import { injectable } from 'inversify';
import { CarbonFootprintRepository } from '../../domain/ports/repositories/carbon-footprint.repository';

@injectable()
export class RestCarbonFootprintRepository implements CarbonFootprintRepository {
  readonly baseUrl = 'http://localhost:8080/carbon-footprint/';

  async calculate(simulationDto: SimulationDto): Promise<number> {
    const { data } = await axios.post<number>(`${this.baseUrl}calculate`, simulationDto);
    return data;
  }
}
