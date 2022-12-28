import { InMemorySimulationDataRepository } from '../../tests/repositories/in-memory-simulation-data.repository';
import { SimulationDataMapper } from '../entities/simulation-data-mapper';
import { SimulationDataImportUseCase } from './simulation-data-import.usecase';

describe('Simulation data importer use case', () => {
  let simulationDataImportUseCase: SimulationDataImportUseCase;

  describe('If "formule" is a number, it should import ', () => {
    beforeEach(() => {
      simulationDataImportUseCase = new SimulationDataImportUseCase(new InMemorySimulationDataRepository(), new SimulationDataMapper());
    });

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

  describe('Should not import', () => {
    beforeEach(() => {
      simulationDataImportUseCase = new SimulationDataImportUseCase(
        new InMemorySimulationDataRepository(false),
        new SimulationDataMapper(),
      );
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
  });
});
