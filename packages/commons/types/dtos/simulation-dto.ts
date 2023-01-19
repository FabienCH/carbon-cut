import { BreakfastTypes, MilkTypes } from '../alimentation';
import { HotBeverages } from '../beverages';

export interface SimulationDto {
  breakfast: BreakfastTypes;
  hotBeverages: HotBeverages;
  milkType?: MilkTypes;
}
