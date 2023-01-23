import { BreakfastTypes, MilkTypes } from '../alimentation';
import { ColdBeveragesAnswer, HotBeveragesAnswer } from '../beverages';

export interface SimulationDto {
  breakfast: BreakfastTypes;
  hotBeverages: HotBeveragesAnswer;
  coldBeverages: ColdBeveragesAnswer;
  milkType?: MilkTypes;
}
