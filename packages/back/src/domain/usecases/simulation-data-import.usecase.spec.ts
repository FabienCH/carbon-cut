import { InMemorySimulationDataSourceRepository } from '../../tests/repositories/in-memory-simulation-data-source.repository';
import { InMemorySimulationDataRepository } from '../../tests/repositories/in-memory-simulation-data.repository';
import { SimulationDataSourceMapper } from '../entities/simulation-datasource-mapper';
import { SimulationDataImportUseCase } from './simulation-data-import.usecase';

describe('Simulation data importer use case', () => {
  let simulationDataImportUseCase: SimulationDataImportUseCase;
  let simulationDataRepository: InMemorySimulationDataRepository;

  beforeEach(() => {
    simulationDataRepository = new InMemorySimulationDataRepository();

    simulationDataImportUseCase = new SimulationDataImportUseCase(
      new InMemorySimulationDataSourceRepository(),
      simulationDataRepository,
      new SimulationDataSourceMapper(),
    );
  });

  describe('If "formule" is a number, it should import ', () => {
    it('grounded coffee footprint', async () => {
      await simulationDataImportUseCase.execute();
      const alimentationData = simulationDataRepository.simulationData;
      expect(alimentationData.footprints.groundedCoffee).toEqual(10.09);
    });

    it('quantity of coffee in kg per cup', async () => {
      await simulationDataImportUseCase.execute();
      const alimentationData = simulationDataRepository.simulationData;
      expect(alimentationData.quantities.coffeePerCup).toEqual(0.012);
    });

    it('infused tea footprint', async () => {
      await simulationDataImportUseCase.execute();
      const alimentationData = simulationDataRepository.simulationData;
      expect(alimentationData.footprints.infusedTea).toEqual(0.04);
    });
  });

  describe('If "formule" is a string, it should import ', () => {
    it('tea heating reduction percentage', async () => {
      await simulationDataImportUseCase.execute();
      const alimentationData = simulationDataRepository.simulationData;
      expect(alimentationData.multipliers.teaHeatingPercent).toEqual(0.25);
    });
  });

  describe('If "formule" is an object, it should import ', () => {
    it('local food reduction percentage', async () => {
      await simulationDataImportUseCase.execute();
      const alimentationData = simulationDataRepository.simulationData;
      expect(alimentationData.multipliers.localFoodReductionPercent).toEqual({ always: 1, often: 0.666, sometimes: 0.333 });
    });

    it('local meal reduction percentage', async () => {
      await simulationDataImportUseCase.execute();
      const alimentationData = simulationDataRepository.simulationData;
      expect(alimentationData.multipliers.localMealReductionPercent).toEqual({
        vegan: 0.12,
        vegetarian: 0.08,
        whiteMeat: 0.03,
        redMeat: 0.01,
        fish: 0.05,
        whiteFish: 0.06,
        breakfast: 0.08,
      });
    });
  });

  describe('Should not import', () => {
    beforeEach(() => {
      simulationDataImportUseCase = new SimulationDataImportUseCase(
        new InMemorySimulationDataSourceRepository(true),
        simulationDataRepository,
        new SimulationDataSourceMapper(),
      );
    });

    it('missing grounded coffee footprint', async () => {
      await simulationDataImportUseCase.execute();
      const alimentationData = simulationDataRepository.simulationData;
      expect(alimentationData.footprints.groundedCoffee).toBeUndefined();
    });

    it('string formula without numerical value', async () => {
      await simulationDataImportUseCase.execute();
      const alimentationData = simulationDataRepository.simulationData;
      expect(alimentationData.quantities.coffeePerCup).toBeUndefined();
    });

    it('object formula without numerical "somme" or "variation"', async () => {
      await simulationDataImportUseCase.execute();
      const alimentationData = simulationDataRepository.simulationData;
      expect(alimentationData.footprints.infusedTea).toBeUndefined();
    });

    it('if no percentage in "somme"', async () => {
      await simulationDataImportUseCase.execute();
      const alimentationData = simulationDataRepository.simulationData;
      expect(alimentationData.multipliers.localMealReductionPercent).toBeUndefined();
    });
  });
});
