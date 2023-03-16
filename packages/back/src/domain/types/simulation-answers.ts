import { BreakfastTypes, CarAnswer, ColdBeveragesAnswer, HotBeveragesAnswer, MealsAnswer, MilkTypes } from 'carbon-cut-commons';

export interface AlimentationAnswers {
  breakfast: BreakfastTypes;
  hotBeverages: HotBeveragesAnswer;
  coldBeverages: ColdBeveragesAnswer;
  milkType?: MilkTypes;
  meals: MealsAnswer;
}

export interface TransportAnswers {
  car: CarAnswer;
}

export interface SimulationAnswers {
  alimentation: AlimentationAnswers;
  transport: TransportAnswers;
}
