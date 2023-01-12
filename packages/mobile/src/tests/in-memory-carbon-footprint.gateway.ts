import { CarbonFootprintDto, SimulationDto } from 'carbon-cut-commons';
import { injectable } from 'inversify';
import { CarbonFootprintGateway } from '../domain/ports/gateways/carbon-footprint.gateway';

@injectable()
export class InMemoryCarbonFootprintGateway implements CarbonFootprintGateway {
  async calculate(_: SimulationDto): Promise<CarbonFootprintDto> {
    return { breakfast: 171.234, beverages: { coffee: 124.14, tea: 32.4, hotChocolate: 80.57 }, total: 408.344 };
  }
}
