import { BreakfastTypes, SimulationDto } from 'carbon-cut-commons';

export const defaultSimulationAnswers: SimulationDto = {
  breakfast: BreakfastTypes.noBreakfast,
  hotBeverages: { coffee: 0, tea: 0, hotChocolate: 0 },
  coldBeverages: { sweet: 0, alcohol: 0 },
  meals: { vegan: 0, vegetarian: 0, whiteMeat: 0, redMeat: 0, whiteFish: 0, fish: 0 },
};
