import { BreakfastTypes, CarSize, EngineType, FuelType, MilkTypes } from 'carbon-cut-commons';
import { defaultCarbonFootprint, defaultMealsFootprint } from '../../tests/carbon-footprints';
import { InMemorySimulationDataRepository } from '../../tests/repositories/in-memory-simulation-data.repository';
import { defaultAlimentationAnswers, defaultSimulationAnswers, defaultTransportAnswers } from '../../tests/simulation-answers';
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
        total: 1384.153,
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
        total: 1417.921,
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
        total: 1353.681,
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
        total: 1460.28,
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
        total: 1427.743,
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
        total: 1299.939,
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
        total: 1292.291,
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
        total: 1261.18,
      });
    });

    it('for 6l/100km diesel car and 10 thousand km per year', async () => {
      const footprint = await calculateCarbonFootprintUseCase.execute({
        ...defaultSimulationAnswers,
        transport: {
          car: { ...defaultTransportAnswers.car, km: 10000, fuelType: FuelType.diesel, fuelConsumption: 6 },
        },
      });

      expect(footprint).toEqual({
        ...defaultCarbonFootprint,
        transport: {
          car: 1842,
          total: 1842,
        },
        total: 3089.101,
      });
    });

    it('for 7.5l/100km E85 essence car and 8 thousand km per year', async () => {
      const footprint = await calculateCarbonFootprintUseCase.execute({
        ...defaultSimulationAnswers,
        transport: {
          car: { ...defaultTransportAnswers.car, km: 8000, fuelType: FuelType.essenceE85, fuelConsumption: 7.5 },
        },
      });

      expect(footprint).toEqual({
        ...defaultCarbonFootprint,
        transport: {
          car: 666,
          total: 666,
        },
        total: 1913.101,
      });
    });

    it('for an hybride car with 8l/100km E10 essence car and 7 thousand km per year', async () => {
      const footprint = await calculateCarbonFootprintUseCase.execute({
        ...defaultSimulationAnswers,
        transport: {
          car: { km: 7000, engineType: EngineType.hybrid, fuelType: FuelType.essenceE10, fuelConsumption: 8 },
        },
      });

      expect(footprint).toEqual({
        ...defaultCarbonFootprint,
        transport: {
          car: 1285.2,
          total: 1285.2,
        },
        total: 2532.301,
      });
    });

    it('for a small electrical car and 9 thousand km per year', async () => {
      const footprint = await calculateCarbonFootprintUseCase.execute({
        ...defaultSimulationAnswers,
        transport: {
          car: { km: 9000, engineType: EngineType.electric, carSize: CarSize.small },
        },
      });

      expect(footprint).toEqual({
        ...defaultCarbonFootprint,
        transport: {
          car: 143.1,
          total: 143.1,
        },
        total: 1390.201,
      });
    });

    it('for a SUV electrical car and 11 thousand km per year', async () => {
      const footprint = await calculateCarbonFootprintUseCase.execute({
        ...defaultSimulationAnswers,
        transport: {
          car: { km: 11000, engineType: EngineType.electric, carSize: CarSize.SUV },
        },
      });

      expect(footprint).toEqual({
        ...defaultCarbonFootprint,
        transport: {
          car: 300.3,
          total: 300.3,
        },
        total: 1547.401,
      });
    });

    it('for a medium electrical car and 11 thousand km per year', async () => {
      const footprint = await calculateCarbonFootprintUseCase.execute({
        ...defaultSimulationAnswers,
        transport: {
          car: { km: 11000, engineType: EngineType.electric, carSize: CarSize.medium },
        },
      });

      expect(footprint).toEqual({
        ...defaultCarbonFootprint,
        transport: {
          car: 217.8,
          total: 217.8,
        },
        total: 1464.901,
      });
    });
  });

  describe('Simulation validation', () => {
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

    it('should have a fuel type and fuel consumption if engine type is thermal', async () => {
      await expect(
        calculateCarbonFootprintUseCase.execute({
          ...defaultSimulationAnswers,
          transport: { car: { km: 1000, engineType: EngineType.thermal } },
        }),
      ).rejects.toThrowError(
        new ValidationError([
          'Fuel type should not be empty with thermal engine type',
          'Fuel consumption should not be empty with thermal engine type',
        ]),
      );
    });

    it('should have a fuel type and fuel consumption if engine type is hybrid', async () => {
      await expect(
        calculateCarbonFootprintUseCase.execute({
          ...defaultSimulationAnswers,
          transport: { car: { km: 1000, engineType: EngineType.hybrid } },
        }),
      ).rejects.toThrowError(
        new ValidationError([
          'Fuel type should not be empty with hybrid engine type',
          'Fuel consumption should not be empty with hybrid engine type',
        ]),
      );
    });

    it('should have a car size if engine type is electric', async () => {
      await expect(
        calculateCarbonFootprintUseCase.execute({
          ...defaultSimulationAnswers,
          transport: { car: { km: 1000, engineType: EngineType.electric } },
        }),
      ).rejects.toThrowError(new ValidationError(['Car size should not be empty with electric engine type']));
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

    it('should not have negatives values in meals', async () => {
      await expect(
        calculateCarbonFootprintUseCase.execute({
          ...defaultSimulationAnswers,
          alimentation: {
            ...defaultAlimentationAnswers,
            breakfast: BreakfastTypes.britishBreakfast,
            meals: { vegan: 2, vegetarian: -2, whiteMeat: 2, redMeat: -2, whiteFish: 2, fish: -3 },
          },
        }),
      ).rejects.toThrowError(
        new ValidationError([
          'meals.vegetarian must be positive, -2 given',
          'meals.redMeat must be positive, -2 given',
          'meals.fish must be positive, -3 given',
        ]),
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

  it('should  have negatives values in transport car km', async () => {
    await expect(
      calculateCarbonFootprintUseCase.execute({
        ...defaultSimulationAnswers,
        transport: {
          ...defaultTransportAnswers,
          car: { ...defaultTransportAnswers.car, km: -100 },
        },
      }),
    ).rejects.toThrowError(new ValidationError(['car.km must be positive, -100 given']));
  });

  it('should  have negatives values in transport car fuel consumption', async () => {
    await expect(
      calculateCarbonFootprintUseCase.execute({
        ...defaultSimulationAnswers,
        transport: {
          ...defaultTransportAnswers,
          car: { ...defaultTransportAnswers.car, fuelConsumption: -2 },
        },
      }),
    ).rejects.toThrowError(new ValidationError(['car.fuelConsumption must be positive, -2 given']));
  });
});
