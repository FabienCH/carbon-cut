import { AlimentationDto, BreakfastTypes, EngineType, SimulationDto, TransportDto } from 'carbon-cut-commons';

export const defaultAlimentationAnswers: AlimentationDto = {
  breakfast: BreakfastTypes.noBreakfast,
  hotBeverages: { coffee: 0, tea: 0, hotChocolate: 0 },
  coldBeverages: { sweet: 0, alcohol: 0 },
  meals: { vegan: 4, vegetarian: 3, whiteMeat: 3, redMeat: 1, whiteFish: 1, fish: 2 },
};

export const defaultTransportAnswers: TransportDto = {
  car: { km: 0, engineType: EngineType.thermal },
};

export const defaultSimulationAnswers: SimulationDto = {
  alimentation: defaultAlimentationAnswers,
  transport: defaultTransportAnswers,
};
