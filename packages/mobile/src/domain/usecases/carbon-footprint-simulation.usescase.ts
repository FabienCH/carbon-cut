import { BreakfastTypes } from 'carbon-cut-types';
import { inject, injectable } from 'inversify';
import { TYPES } from '../../infrastructure/ui/inversify-types';
import type { CarbonFootprintRepository } from '../ports/repositories/carbon-footprint.repository';

@injectable()
export class CarbonFootprintSimulationUseCase {
  constructor(@inject(TYPES.CarbonFootprintRepository) private readonly carbonFootprintRepository: CarbonFootprintRepository) {}

  async execute(breakfast: BreakfastTypes | null) {
    if (breakfast) {
      const footprint = await this.carbonFootprintRepository.calculate({ breakfast });
      console.log('footprint', footprint);
    }
  }
}
