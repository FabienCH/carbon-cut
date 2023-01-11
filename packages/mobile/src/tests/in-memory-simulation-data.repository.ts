import { SimulationDto } from 'carbon-cut-types';
import { injectable } from 'inversify';
import { CarbonFootprintRepository } from '../domain/ports/repositories/carbon-footprint.repository';

@injectable()
export class InMemoryCarbonFootprintRepository implements CarbonFootprintRepository {
  async calculate(_: SimulationDto): Promise<number> {
    return 171.234;
  }
}
