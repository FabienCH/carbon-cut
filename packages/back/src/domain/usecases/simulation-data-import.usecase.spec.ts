import { InMemorySimulationDataRepository } from '../../tests/repositories/in-memory-simulation-data.repository';
import { SimulationDataMapper } from '../entities/simulation-data-mapper';
import { SimulationDataImportUseCase } from './simulation-data-import.usecase';

describe('Simulation data importer use case', () => {
  let simulationDataImportUseCase: SimulationDataImportUseCase;
  beforeEach(() => {
    simulationDataImportUseCase = new SimulationDataImportUseCase(new InMemorySimulationDataRepository(), new SimulationDataMapper());
  });

  describe('If "formule" is a number, it should import ', () => {
    it('grounded coffee footprint', async () => {
      const alimentationData = await simulationDataImportUseCase.execute();
      expect(alimentationData.footprints.groundedCoffee).toEqual(10.09);
    });

    it('quantity of coffee in kg per cup', async () => {
      const alimentationData = await simulationDataImportUseCase.execute();
      expect(alimentationData.quantities.coffeePerCup).toEqual(0.012);
    });

    it('infused tea footprint', async () => {
      const alimentationData = await simulationDataImportUseCase.execute();
      expect(alimentationData.footprints.infusedTea).toEqual(0.04);
    });
  });

  describe('If "formule" is a string, it should import ', () => {
    it('tea heating footprint percentage', async () => {
      const alimentationData = await simulationDataImportUseCase.execute();
      expect(alimentationData.footprints.teaHeatingPercent).toEqual(0.25);
    });
  });

  describe('If "formule" is an object, it should import ', () => {
    it('local food reduction percentage', async () => {
      const alimentationData = await simulationDataImportUseCase.execute();
      expect(alimentationData.multipliers.localFoodReductionPercent).toEqual({ always: 1, often: 0.666, sometimes: 0.333 });
    });

    it('local meal reduction percentage', async () => {
      const alimentationData = await simulationDataImportUseCase.execute();
      expect(alimentationData.multipliers.localMealReductionPercent).toEqual({
        vegan: 0.12,
        vegetarian: 0.08,
        whiteMeat: 0.03,
        redMeat: 0.01,
        fish: 0.05,
        whiteFish: 0.06,
        breakfast: 0.011,
      });
    });
  });

  describe('Should not import', () => {
    beforeEach(() => {
      simulationDataImportUseCase = new SimulationDataImportUseCase(new InMemorySimulationDataRepository(true), new SimulationDataMapper());
    });

    it('missing grounded coffee footprint', async () => {
      const alimentationData = await simulationDataImportUseCase.execute();
      expect(alimentationData.footprints.groundedCoffee).toBeUndefined();
    });

    it('string formula', async () => {
      const alimentationData = await simulationDataImportUseCase.execute();
      expect(alimentationData.quantities.coffeePerCup).toBeUndefined();
    });

    it('object formula', async () => {
      const alimentationData = await simulationDataImportUseCase.execute();
      expect(alimentationData.footprints.infusedTea).toBeUndefined();
    });

    it('if no percentage in "somme"', async () => {
      const alimentationData = await simulationDataImportUseCase.execute();
      expect(alimentationData.multipliers.localMealReductionPercent).toBeUndefined();
    });
  });
});
