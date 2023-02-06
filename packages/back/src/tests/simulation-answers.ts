import { BreakfastTypes, SimulationDto } from 'carbon-cut-commons';

export const defaultSimulationAnswers: SimulationDto = {
  breakfast: BreakfastTypes.noBreakfast,
  hotBeverages: { coffee: 0, tea: 0, hotChocolate: 0 },
  coldBeverages: { sweet: 0, alcohol: 0 },
  meals: { vegan: 3, vegetarian: 4, whiteMeat: 2, redMeat: 1, whiteFish: 2, fish: 2 },
};
