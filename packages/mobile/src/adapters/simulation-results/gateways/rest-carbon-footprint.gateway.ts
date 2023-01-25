import axios from 'axios';
import { CarbonFootprintDto, SimulationDto } from 'carbon-cut-commons';
import { injectable } from 'inversify';
import { CarbonFootprintGateway } from '../../../domain/ports/gateways/carbon-footprint.gateway';

@injectable()
export class RestCarbonFootprintGateway implements CarbonFootprintGateway {
  readonly baseUrl = 'http://localhost:8080/carbon-footprint/';

  async calculate(simulationDto: SimulationDto): Promise<CarbonFootprintDto> {
    const { data } = await axios.post<CarbonFootprintDto>(`${this.baseUrl}calculate`, simulationDto);
    return data;
  }
}
