import { BreakfastTypes } from 'carbon-cut-types';

export interface CarbonFootprintController {
  calculate(breakfast: BreakfastTypes): Promise<number>;
}
