import { BreakfastTypes, MilkTypes } from '../alimentation-enums';
import { ColdBeveragesAnswer, HotBeveragesAnswer } from '../beverages';
import { CarAnswer } from '../car';
import { MealsAnswer } from '../meals';

export interface AlimentationDto {
  breakfast: BreakfastTypes;
  hotBeverages: HotBeveragesAnswer;
  coldBeverages: ColdBeveragesAnswer;
  milkType?: MilkTypes;
  meals: MealsAnswer;
}

export interface TransportDto {
  car: CarAnswer;
}

export interface SimulationDto {
  alimentation: AlimentationDto;
  transport: TransportDto;
}
