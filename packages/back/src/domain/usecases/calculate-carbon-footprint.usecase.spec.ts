import { BreakfastTypes, MilkTypes } from 'carbon-cut-commons';
import { defaultCarbonFootprint, defaultMealsFootprint } from '../../tests/carbon-footprints';
import { InMemorySimulationDataRepository } from '../../tests/repositories/in-memory-simulation-data.repository';
import { defaultAlimentationAnswers, defaultSimulationAnswers, defaultTransportAnswers } from '../../tests/simulation-answers';
import { ValidationError } from '../entities/validation-error';
import { CalculateCarbonFootprintUseCase } from './calculate-carbon-footprint.usecase';

fdescribe('Carbon footprint calculation use case', () => {
  let calculateCarbonFootprintUseCase: CalculateCarbonFootprintUseCase;

  beforeEach(() => {
    calculateCarbonFootprintUseCase = new CalculateCarbonFootprintUseCase(new InMemorySimulationDataRepository(true));
  });

  fdescribe('Calculate a yearly carbon footprint', () => {
    it('for a continental breakfast with 5 coffees per week', async () => {
      const footprint = await calculateCarbonFootprintUseCase.execute({
        ...defaultSimulationAnswers,
        alimentation: {
          ...defaultAlimentationAnswers,
          breakfast: BreakfastTypes.continentalBreakfast,
          hotBeverages: { ...defaultAlimentationAnswers.hotBeverages, coffee: 5 },
        },
      });
      expect(footprint).toEqual({
        ...defaultCarbonFootprint,
        alimentation: {
          breakfast: 105.485,
          hotBeverages: { coffee: 31.567, total: 31.567 },
          meals: defaultMealsFootprint,
          total: 1384.153,
        },
      });
    });

    it('for a breakfast with cow milk and cereal', async () => {
      const footprint = await calculateCarbonFootprintUseCase.execute({
        ...defaultSimulationAnswers,
        alimentation: {
          ...defaultAlimentationAnswers,
          breakfast: BreakfastTypes.milkCerealBreakfast,
          milkType: MilkTypes.cowMilk,
        },
      });

      expect(footprint).toEqual({
        ...defaultCarbonFootprint,
        alimentation: { breakfast: 170.82, meals: defaultMealsFootprint, total: 1417.921 },
      });
    });

    it('for a breakfast with soja milk and cereal', async () => {
      const footprint = await calculateCarbonFootprintUseCase.execute({
        ...defaultSimulationAnswers,
        alimentation: {
          ...defaultAlimentationAnswers,
          breakfast: BreakfastTypes.milkCerealBreakfast,
          milkType: MilkTypes.sojaMilk,
        },
      });

      expect(footprint).toEqual({
        ...defaultCarbonFootprint,
        alimentation: { breakfast: 106.58, meals: defaultMealsFootprint, total: 1353.681 },
      });
    });

    it('for no breakfast with coffee tea and hot chocolate with cow milk', async () => {
      const footprint = await calculateCarbonFootprintUseCase.execute({
        ...defaultSimulationAnswers,
        alimentation: {
          ...defaultAlimentationAnswers,
          hotBeverages: { coffee: 7, tea: 2, hotChocolate: 4 },
          milkType: MilkTypes.cowMilk,
        },
      });

      expect(footprint).toEqual({
        ...defaultCarbonFootprint,
        alimentation: {
          hotBeverages: { coffee: 44.194, tea: 1.043, hotChocolate: 167.942, total: 213.179 },
          meals: defaultMealsFootprint,
          total: 1460.28,
        },
      });
    });

    it('for no breakfast with coffee tea and hot chocolate with oats milk', async () => {
      const footprint = await calculateCarbonFootprintUseCase.execute({
        ...defaultSimulationAnswers,
        alimentation: {
          ...defaultAlimentationAnswers,
          hotBeverages: { coffee: 7, tea: 2, hotChocolate: 4 },
          milkType: MilkTypes.oatsMilk,
        },
      });

      expect(footprint).toEqual({
        ...defaultCarbonFootprint,
        alimentation: {
          hotBeverages: { coffee: 44.194, tea: 1.043, hotChocolate: 135.405, total: 180.642 },
          meals: defaultMealsFootprint,
          total: 1427.743,
        },
      });
    });

    it('for 2 liters of sweet beverages (soda, fruit juice, sirop...)', async () => {
      const footprint = await calculateCarbonFootprintUseCase.execute({
        ...defaultSimulationAnswers,
        alimentation: {
          ...defaultAlimentationAnswers,
          coldBeverages: { ...defaultAlimentationAnswers.coldBeverages, sweet: 2 },
        },
      });

      expect(footprint).toEqual({
        ...defaultCarbonFootprint,
        alimentation: { coldBeverages: { sweet: 52.838, total: 52.838 }, meals: defaultMealsFootprint, total: 1299.939 },
      });
    });

    it('for 0.8 liters of alcohol (beer, wine, cocktail...)', async () => {
      const footprint = await calculateCarbonFootprintUseCase.execute({
        ...defaultSimulationAnswers,
        alimentation: {
          ...defaultAlimentationAnswers,
          coldBeverages: { ...defaultAlimentationAnswers.coldBeverages, alcohol: 0.8 },
        },
      });

      expect(footprint).toEqual({
        ...defaultCarbonFootprint,
        alimentation: { coldBeverages: { alcohol: 45.19, total: 45.19 }, meals: defaultMealsFootprint, total: 1292.291 },
      });
    });

    it('with 4 vegans, 3 vegetarians, 2 white meat, 1 read meat, 2 white fishes and 2 red fishes meals', async () => {
      const footprint = await calculateCarbonFootprintUseCase.execute({
        ...defaultSimulationAnswers,
        alimentation: {
          ...defaultAlimentationAnswers,
          meals: { vegan: 4, vegetarian: 3, whiteMeat: 2, redMeat: 1, whiteFish: 2, fish: 2 },
        },
      });

      expect(footprint).toEqual({
        ...defaultCarbonFootprint,
        alimentation: {
          meals: {
            fish: 169.986,
            redMeat: 287.307,
            total: 1261.18,
            vegan: 163.729,
            vegetarian: 174.418,
            whiteFish: 246.949,
            whiteMeat: 218.791,
          },
          total: 1261.18,
        },
      });
    });

    it('for 6l/100km diesel car and 10 thousand km per year', async () => {
      const footprint = await calculateCarbonFootprintUseCase.execute({
        ...defaultSimulationAnswers,
        transport: {
          car: { ...defaultTransportAnswers.car, km: 10000, fuelType: 'Diesel', fuelConsumption: 6 },
        },
      });

      expect(footprint).toEqual({
        ...defaultCarbonFootprint,
        transport: {
          car: 1842,
          total: 1842,
        },
      });
    });

    it('for 7.5l/100km E85 essence car and 8 thousand km per year', async () => {
      const footprint = await calculateCarbonFootprintUseCase.execute({
        ...defaultSimulationAnswers,
        transport: {
          car: { ...defaultTransportAnswers.car, km: 8000, fuelType: 'EssenceE85', fuelConsumption: 7.5 },
        },
      });

      expect(footprint).toEqual({
        ...defaultCarbonFootprint,
        transport: {
          car: 666,
          total: 666,
        },
      });
    });

    it('for an hybride car with 8l/100km E10 essence car and 7 thousand km per year', async () => {
      const footprint = await calculateCarbonFootprintUseCase.execute({
        ...defaultSimulationAnswers,
        transport: {
          car: { km: 7000, engineType: 'hybrid', fuelType: 'EssenceE10', fuelConsumption: 8 },
        },
      });

      expect(footprint).toEqual({
        ...defaultCarbonFootprint,
        transport: {
          car: 1285.2,
          total: 1285.2,
        },
      });
    });
  });

  xdescribe('Simulation validation', () => {
    it('should have a milk type if it has cereal with milk breakfast', async () => {
      await expect(
        calculateCarbonFootprintUseCase.execute({
          ...defaultSimulationAnswers,
          alimentation: {
            ...defaultAlimentationAnswers,
            breakfast: BreakfastTypes.milkCerealBreakfast,
          },
        }),
      ).rejects.toThrowError(new ValidationError(['Milk type should not be empty with cereal milk breakfast']));
    });

    it('should have a milk type if it has hot chocolate beverages', async () => {
      await expect(
        calculateCarbonFootprintUseCase.execute({
          ...defaultSimulationAnswers,
          alimentation: {
            ...defaultAlimentationAnswers,
            breakfast: BreakfastTypes.britishBreakfast,
            hotBeverages: { ...defaultAlimentationAnswers.hotBeverages, hotChocolate: 2 },
          },
        }),
      ).rejects.toThrowError(new ValidationError(['Milk type should not be empty with hot chocolate beverage']));
    });

    it('should not have negatives values in hot beverages', async () => {
      await expect(
        calculateCarbonFootprintUseCase.execute({
          ...defaultSimulationAnswers,
          alimentation: {
            ...defaultAlimentationAnswers,
            breakfast: BreakfastTypes.britishBreakfast,
            hotBeverages: { coffee: -3, hotChocolate: -2, tea: -0.5 },
          },
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
          alimentation: {
            ...defaultAlimentationAnswers,
            breakfast: BreakfastTypes.britishBreakfast,
            coldBeverages: { sweet: -0.7, alcohol: -2 },
          },
        }),
      ).rejects.toThrowError(
        new ValidationError(['coldBeverages.sweet must be positive, -0.7 given', 'coldBeverages.alcohol must be positive, -2 given']),
      );
    });

    it('should not have a number of meals lower than 14', async () => {
      await expect(
        calculateCarbonFootprintUseCase.execute({
          ...defaultSimulationAnswers,
          alimentation: {
            ...defaultAlimentationAnswers,
            breakfast: BreakfastTypes.britishBreakfast,
            meals: { vegan: 2, vegetarian: 2, whiteMeat: 2, redMeat: 2, whiteFish: 2, fish: 3 },
          },
        }),
      ).rejects.toThrowError(new ValidationError(['The number of meals must be 14, 13 given']));
    });

    it('should not have a number of meals higher than 14', async () => {
      await expect(
        calculateCarbonFootprintUseCase.execute({
          ...defaultSimulationAnswers,
          alimentation: {
            ...defaultAlimentationAnswers,
            breakfast: BreakfastTypes.britishBreakfast,
            meals: { vegan: 2, vegetarian: 2, whiteMeat: 2, redMeat: 3.1, whiteFish: 2, fish: 3 },
          },
        }),
      ).rejects.toThrowError(new ValidationError(['The number of meals must be 14, 14.1 given']));
    });
  });
});
