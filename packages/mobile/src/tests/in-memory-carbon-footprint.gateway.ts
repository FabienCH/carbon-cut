import { SimulationDto } from 'carbon-cut-commons';
import { injectable } from 'inversify';
import { CarbonFootprintGateway } from '../domain/ports/gateways/carbon-footprint.gateway';

@injectable()
export class InMemoryCarbonFootprintGateway implements CarbonFootprintGateway {
  async calculate(_: SimulationDto): Promise<number> {
    return 171.234;
  }
}
