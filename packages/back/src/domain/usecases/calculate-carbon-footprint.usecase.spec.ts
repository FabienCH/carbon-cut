import { InMemorySimulationDataRepository } from '../../tests/repositories/in-memory-simulation-data.repository';
import { CalculateCarbonFootprintUseCase } from './calculate-carbon-footprint.usecase';

describe('Carbon footprint calculation use case', () => {
  let calculateCarbonFootprintUseCase: CalculateCarbonFootprintUseCase;

  beforeEach(() => {
    calculateCarbonFootprintUseCase = new CalculateCarbonFootprintUseCase(new InMemorySimulationDataRepository(true));
  });

  describe('Calculate a yearly carbon footprint', () => {
    it('for a continental breakfast ', async () => {
      const footprint = await calculateCarbonFootprintUseCase.execute({ breakfast: 'continentalBreakfast' });
      expect(footprint).toEqual(105.485);
    });

    it('for a breakfast with milk and cereal', async () => {
      const footprint = await calculateCarbonFootprintUseCase.execute({ breakfast: 'cowMilkCerealBreakfast' });

      expect(footprint).toEqual(170.82);
    });

    it('for a vegan breakfast ', async () => {
      const footprint = await calculateCarbonFootprintUseCase.execute({ breakfast: 'veganBreakfast' });

      expect(footprint).toEqual(152.935);
    });
  });
});
