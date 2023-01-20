import { BreakfastTypes, MilkTypes } from '../alimentation';
import { ColdBeverages, HotBeverages } from '../beverages';

export interface SimulationDto {
  breakfast: BreakfastTypes;
  hotBeverages: HotBeverages;
  coldBeverages: ColdBeverages;
  milkType?: MilkTypes;
}
