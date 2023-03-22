import {
  BreakfastTypes,
  CarAnswer,
  CarSize,
  ColdBeveragesAnswer,
  FuelType,
  HotBeveragesAnswer,
  MealsAnswer,
  MilkTypes,
} from 'carbon-cut-commons';

export interface AlimentationAnswers {
  breakfast: BreakfastTypes;
  hotBeverages: HotBeveragesAnswer;
  coldBeverages: ColdBeveragesAnswer;
  milkType: MilkTypes | null;
  meals: MealsAnswer;
}

export interface TransportAnswers {
  carUsage: { km: CarAnswer['km']; engineType: CarAnswer['engineType'] };
  electricCar: { size: CarSize } | null;
  fuelCar: { fuelType: FuelType; fuelConsumption: number } | null;
}

export interface SimulationAnswers {
  alimentation: AlimentationAnswers;
  transport: TransportAnswers;
}
