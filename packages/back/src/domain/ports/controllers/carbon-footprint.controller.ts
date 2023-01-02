import { BreakfastTypes } from '../../entities/simulation-data';

export interface CarbonFootprintController {
  calculate(breakfast: BreakfastTypes): Promise<number>;
}
