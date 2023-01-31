import { BreakfastTypes, MilkTypes } from 'carbon-cut-commons';
import { InMemorySimulationDataRepository } from '../../tests/repositories/in-memory-simulation-data.repository';
import { defaultSimulationAnswers } from '../../tests/simulation-answers';
import { ValidationError } from '../entities/validation-error';
import { CalculateCarbonFootprintUseCase } from './calculate-carbon-footprint.usecase';

describe('Carbon footprint calculation use case', () => {
  let calculateCarbonFootprintUseCase: CalculateCarbonFootprintUseCase;

  beforeEach(() => {
    calculateCarbonFootprintUseCase = new CalculateCarbonFootprintUseCase(new InMemorySimulationDataRepository(true));
  });

  describe('Calculate a yearly carbon footprint', () => {
    it('for a continental breakfast with 5 coffees per week', async () => {
      const footprint = await calculateCarbonFootprintUseCase.execute({
        ...defaultSimulationAnswers,
        breakfast: BreakfastTypes.continentalBreakfast,
        hotBeverages: { ...defaultSimulationAnswers.hotBeverages, coffee: 5 },
      });
      expect(footprint).toEqual({ breakfast: 105.485, hotBeverages: { coffee: 31.567, total: 31.567 }, total: 137.052 });
    });

    it('for a breakfast with cow milk and cereal', async () => {
      const footprint = await calculateCarbonFootprintUseCase.execute({
        ...defaultSimulationAnswers,
        breakfast: BreakfastTypes.milkCerealBreakfast,
        milkType: MilkTypes.cowMilk,
      });

      expect(footprint).toEqual({ breakfast: 170.82, total: 170.82 });
    });

    it('for a breakfast with soja milk and cereal', async () => {
      const footprint = await calculateCarbonFootprintUseCase.execute({
        ...defaultSimulationAnswers,
        breakfast: BreakfastTypes.milkCerealBreakfast,
        milkType: MilkTypes.sojaMilk,
      });

      expect(footprint).toEqual({ breakfast: 106.58, total: 106.58 });
    });

    it('for a vegan breakfast ', async () => {
      const footprint = await calculateCarbonFootprintUseCase.execute({
        ...defaultSimulationAnswers,
        breakfast: BreakfastTypes.veganBreakfast,
      });

      expect(footprint).toEqual({ breakfast: 152.935, total: 152.935 });
    });

    it('for no breakfast with coffee tea and hot chocolate with cow milk', async () => {
      const footprint = await calculateCarbonFootprintUseCase.execute({
        ...defaultSimulationAnswers,
        hotBeverages: { coffee: 7, tea: 2, hotChocolate: 4 },
        milkType: MilkTypes.cowMilk,
      });

      expect(footprint).toEqual({ hotBeverages: { coffee: 44.194, tea: 1.043, hotChocolate: 167.942, total: 213.179 }, total: 213.179 });
    });

    it('for no breakfast with coffee tea and hot chocolate with oats milk', async () => {
      const footprint = await calculateCarbonFootprintUseCase.execute({
        ...defaultSimulationAnswers,
        hotBeverages: { coffee: 7, tea: 2, hotChocolate: 4 },
        milkType: MilkTypes.oatsMilk,
      });

      expect(footprint).toEqual({ hotBeverages: { coffee: 44.194, tea: 1.043, hotChocolate: 135.405, total: 180.642 }, total: 180.642 });
    });

    it('for 2 liters of sweet beverages (soda, fruit juice, sirop...)', async () => {
      const footprint = await calculateCarbonFootprintUseCase.execute({
        ...defaultSimulationAnswers,
        coldBeverages: { ...defaultSimulationAnswers.coldBeverages, sweet: 2 },
      });

      expect(footprint).toEqual({ coldBeverages: { sweet: 52.838, total: 52.838 }, total: 52.838 });
    });

    it('for 0.8 liters of alcohol (beer, wine, cocktail...)', async () => {
      const footprint = await calculateCarbonFootprintUseCase.execute({
        ...defaultSimulationAnswers,
        coldBeverages: { ...defaultSimulationAnswers.coldBeverages, alcohol: 0.8 },
      });

      expect(footprint).toEqual({ coldBeverages: { alcohol: 45.19, total: 45.19 }, total: 45.19 });
    });

    it('with 4 vegans, 3 vegetarians, 2 white meat, 1 read meat, 2 white fishes and 2 red fishes meals', async () => {
      const footprint = await calculateCarbonFootprintUseCase.execute({
        ...defaultSimulationAnswers,
        meals: { vegan: 4, vegetarian: 3, whiteMeat: 2, redMeat: 1, whiteFish: 2, fish: 2 },
      });

      expect(footprint).toEqual({
        meals: {
          vegan: 1146.1,
          vegetarian: 1220.925,
          whiteMeat: 1531.54,
          redMeat: 2011.15,
          whiteFish: 1728.64,
          fish: 1189.9,
          total: 8828.255,
        },
        total: 8828.255,
      });
    });
  });

  describe('Simulation validation', () => {
    it('should have a milk type if it has cereal with milk breakfast', async () => {
      await expect(
        calculateCarbonFootprintUseCase.execute({
          ...defaultSimulationAnswers,
          breakfast: BreakfastTypes.milkCerealBreakfast,
        }),
      ).rejects.toThrowError('Milk type should not be empty with cereal milk breakfast');
    });

    it('should have a milk type if it has hot chocolate beverages', async () => {
      await expect(
        calculateCarbonFootprintUseCase.execute({
          ...defaultSimulationAnswers,
          breakfast: BreakfastTypes.britishBreakfast,
          hotBeverages: { ...defaultSimulationAnswers.hotBeverages, hotChocolate: 2 },
        }),
      ).rejects.toThrowError('Milk type should not be empty with hot chocolate beverage');
    });

    it('should not have negatives values in hot beverages', async () => {
      await expect(
        calculateCarbonFootprintUseCase.execute({
          ...defaultSimulationAnswers,
          breakfast: BreakfastTypes.britishBreakfast,
          hotBeverages: { coffee: -3, hotChocolate: -2, tea: -0.5 },
        }),
      ).rejects.toThrowError(
        new ValidationError([
          'hotBeverages.coffee must be positive, -3 given',
          'hotBeverages.hotChocolate must be positive, -2 given',
          'hotBeverages.tea must be positive, -0.5 given',
        ]),
      );
    });

    it('should not have negatives values in cold beverages', async () => {
      await expect(
        calculateCarbonFootprintUseCase.execute({
          ...defaultSimulationAnswers,
          breakfast: BreakfastTypes.britishBreakfast,
          coldBeverages: { sweet: -0.7, alcohol: -2 },
        }),
      ).rejects.toThrowError(
        new ValidationError(['coldBeverages.sweet must be positive, -0.7 given', 'coldBeverages.alcohol must be positive, -2 given']),
      );
    });
  });
});
