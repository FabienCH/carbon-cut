import { BreakfastTypes } from '../alimentation';
import { HotBeverages } from '../beverages';
import { MilkTypes } from '../milk-type';

export interface SimulationDto {
  breakfast: BreakfastTypes;
  hotBeverages: HotBeverages;
  milkType?: MilkTypes;
}
