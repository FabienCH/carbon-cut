import { BreakfastTypes } from 'carbon-cut-types';
import { InMemorySimulationDataRepository } from '../../tests/repositories/in-memory-simulation-data.repository';
import { CalculateCarbonFootprintUseCase } from './calculate-carbon-footprint.usecase';

describe('Carbon footprint calculation use case', () => {
  let calculateCarbonFootprintUseCase: CalculateCarbonFootprintUseCase;

  beforeEach(() => {
    calculateCarbonFootprintUseCase = new CalculateCarbonFootprintUseCase(new InMemorySimulationDataRepository(true));
  });

  describe('Calculate a yearly carbon footprint', () => {
    it('for a continental breakfast ', async () => {
      const footprint = await calculateCarbonFootprintUseCase.execute({ breakfast: BreakfastTypes.continentalBreakfast });
      expect(footprint).toEqual(105.485);
    });

    it('for a breakfast with milk and cereal', async () => {
      const footprint = await calculateCarbonFootprintUseCase.execute({ breakfast: BreakfastTypes.cowMilkCerealBreakfast });

      expect(footprint).toEqual(170.82);
    });

    it('for a vegan breakfast ', async () => {
      const footprint = await calculateCarbonFootprintUseCase.execute({ breakfast: BreakfastTypes.veganBreakfast });

      expect(footprint).toEqual(152.935);
    });
  });
});
