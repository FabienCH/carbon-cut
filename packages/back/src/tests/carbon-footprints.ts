import { CarbonFootprintDto } from 'carbon-cut-commons';

export const defaultMealsFootprint = {
  fish: 169.986,
  redMeat: 287.307,
  total: 1247.101,
  vegan: 163.729,
  vegetarian: 174.418,
  whiteFish: 123.474,
  whiteMeat: 328.187,
};

export const defaultCarbonFootprint: CarbonFootprintDto = {
  alimentation: {
    meals: defaultMealsFootprint,
    total: 1247.101,
  },
  transport: { total: 0 },
  total: 1247.101,
};
