import { CarbonFootprintGateway } from '@domain/ports/gateways/carbon-footprint.gateway';
import { SimulationAnswers } from '@domain/types/simulation-answers';
import axios, { AxiosResponse } from 'axios';
import { CarbonFootprintDto, SimulationDto } from 'carbon-cut-commons';
import { injectable } from 'inversify';

@injectable()
export class RestCarbonFootprintGateway implements CarbonFootprintGateway {
  readonly baseUrl = 'http://localhost:8080/carbon-footprint/';

  async calculate(simulationAnswers: SimulationAnswers): Promise<CarbonFootprintDto> {
    const { data } = await axios.post<CarbonFootprintDto, AxiosResponse<CarbonFootprintDto>, SimulationDto>(
      `${this.baseUrl}calculate`,
      this.#mapToSimulationDto(simulationAnswers),
    );
    return data;
  }

  #mapToSimulationDto(simulationAnswers: SimulationAnswers): SimulationDto {
    const { alimentation, transport } = simulationAnswers;
    return {
      alimentation: {
        ...alimentation,
        milkType: alimentation.milkType ?? undefined,
      },
      transport: {
        car: {
          ...transport.carUsage,
          ...transport.electricCar,
          ...transport.fuelCar,
        },
      },
    };
  }
}
