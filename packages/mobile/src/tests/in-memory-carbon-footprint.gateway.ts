import { CarbonFootprintDto, SimulationDto } from 'carbon-cut-commons';
import { injectable } from 'inversify';
import { CarbonFootprintGateway } from '../domain/ports/gateways/carbon-footprint.gateway';

@injectable()
export class InMemoryCarbonFootprintGateway implements CarbonFootprintGateway {
  async calculate(_: SimulationDto): Promise<Required<CarbonFootprintDto>> {
    return {
      breakfast: 171.234,
      hotBeverages: { coffee: 124.14, tea: 32.4, hotChocolate: 80.57, total: 237.11 },
      coldBeverages: { sweet: 34.14, alcohol: 25.34, total: 59.48 },
      meals: {},
      total: 467.824,
    };
  }
}
