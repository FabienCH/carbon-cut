import { InMemorySimulationDataSourceRepository } from '../../tests/repositories/in-memory-simulation-data-source.repository';
import { InMemorySimulationDataRepository } from '../../tests/repositories/in-memory-simulation-data.repository';
import { SimulationDataSourceMapper } from '../entities/simulation-datasource-mapper';
import { AlimentationData } from '../types/alimentation-types';
import { SimulationDataImportUseCase } from './simulation-data-import.usecase';

describe('Simulation data importer use case', () => {
  let simulationDataImportUseCase: SimulationDataImportUseCase;
  let simulationDataRepository: InMemorySimulationDataRepository;
  let alimentationData: AlimentationData;

  beforeEach(() => {
    simulationDataRepository = new InMemorySimulationDataRepository();
    simulationDataImportUseCase = new SimulationDataImportUseCase(
      new InMemorySimulationDataSourceRepository(),
      simulationDataRepository,
      new SimulationDataSourceMapper(),
    );
  });

  describe('If "formule" is a number, it should import ', () => {
    beforeEach(async () => {
      await simulationDataImportUseCase.execute();
      alimentationData = simulationDataRepository.simulationData;
    });

    it('grounded coffee footprint', async () => {
      expect(alimentationData.footprints.groundedCoffee).toEqual(10.09);
    });

    it('quantity of coffee in kg per cup', async () => {
      expect(alimentationData.quantities.coffeePerCup).toEqual(0.012);
    });

    it('infused tea footprint', async () => {
      expect(alimentationData.footprints.infusedTea).toEqual(0.04);
    });
  });

  describe('If "formule" is a string, it should import ', () => {
    it('tea heating reduction percentage', async () => {
      expect(alimentationData.multipliers.teaHeatingPercent).toEqual(0.25);
    });
  });

  describe('If "formule" is an object, it should import ', () => {
    it('local food reduction percentage', async () => {
      expect(alimentationData.multipliers.localFoodReductionPercent).toEqual({ always: 1, often: 0.666, sometimes: 0.333 });
    });

    it('local meal reduction percentage', async () => {
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
    beforeEach(async () => {
      simulationDataImportUseCase = new SimulationDataImportUseCase(
        new InMemorySimulationDataSourceRepository(true),
        simulationDataRepository,
        new SimulationDataSourceMapper(),
      );

      await simulationDataImportUseCase.execute();
      alimentationData = simulationDataRepository.simulationData;
    });

    it('missing grounded coffee footprint', async () => {
      expect(alimentationData.footprints.groundedCoffee).toBeUndefined();
    });

    it('string formula without numerical value', async () => {
      expect(alimentationData.quantities.coffeePerCup).toBeUndefined();
    });

    it('object formula without numerical "somme" or "variation"', async () => {
      expect(alimentationData.footprints.infusedTea).toBeUndefined();
    });

    it('if no percentage in "somme"', async () => {
      expect(alimentationData.multipliers.localMealReductionPercent).toBeUndefined();
    });
  });
});
