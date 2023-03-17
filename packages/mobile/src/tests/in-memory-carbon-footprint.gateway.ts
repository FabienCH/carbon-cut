import { SimulationAnswers } from '@domain/types/simulation-answers';
import { CarbonFootprintDto } from 'carbon-cut-commons';
import { injectable } from 'inversify';
import { CarbonFootprintGateway } from '../domain/ports/gateways/carbon-footprint.gateway';

@injectable()
export class InMemoryCarbonFootprintGateway implements CarbonFootprintGateway {
  async calculate(_: SimulationAnswers): Promise<Required<CarbonFootprintDto>> {
    return {
      alimentation: {
        breakfast: 171.234,
        hotBeverages: { coffee: 124.14, tea: 32.4, hotChocolate: 80.57, total: 237.11 },
        coldBeverages: { sweet: 34.14, alcohol: 25.34, total: 59.48 },
        meals: {
          vegan: 859.575,
          vegetarian: 1220.925,
          whiteMeat: 1531.54,
          redMeat: 4022.3,
          whiteFish: 1728.64,
          fish: 1189.9,
          total: 10552.88,
        },
        total: 467.824,
      },
      transport: { car: 230, total: 230 },
      total: 697.824,
    };
  }
}
