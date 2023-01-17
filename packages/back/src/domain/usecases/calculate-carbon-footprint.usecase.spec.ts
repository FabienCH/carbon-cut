import { BreakfastTypes } from 'carbon-cut-commons';
import { InMemorySimulationDataRepository } from '../../tests/repositories/in-memory-simulation-data.repository';
import { CalculateCarbonFootprintUseCase } from './calculate-carbon-footprint.usecase';

describe('Carbon footprint calculation use case', () => {
  let calculateCarbonFootprintUseCase: CalculateCarbonFootprintUseCase;

  beforeEach(() => {
    calculateCarbonFootprintUseCase = new CalculateCarbonFootprintUseCase(new InMemorySimulationDataRepository(true));
  });

  describe('Calculate a yearly carbon footprint', () => {
    it('for a continental breakfast with 5 coffees per week', async () => {
      const footprint = await calculateCarbonFootprintUseCase.execute({
        breakfast: BreakfastTypes.continentalBreakfast,
        hotBeverages: { coffee: 5, tea: 0, hotChocolate: 0 },
      });
      expect(footprint).toEqual({ breakfast: 105.485, hotBeverages: { coffee: 31.567, total: 31.567 }, total: 137.052 });
    });

    it('for a breakfast with milk and cereal', async () => {
      const footprint = await calculateCarbonFootprintUseCase.execute({
        breakfast: BreakfastTypes.cowMilkCerealBreakfast,
        hotBeverages: { coffee: 0, tea: 0, hotChocolate: 0 },
      });

      expect(footprint).toEqual({ breakfast: 170.82, total: 170.82 });
    });

    it('for a vegan breakfast ', async () => {
      const footprint = await calculateCarbonFootprintUseCase.execute({
        breakfast: BreakfastTypes.veganBreakfast,
        hotBeverages: { coffee: 0, tea: 0, hotChocolate: 0 },
      });

      expect(footprint).toEqual({ breakfast: 152.935, total: 152.935 });
    });

    it('for no breakfast with coffee tea and milk', async () => {
      const footprint = await calculateCarbonFootprintUseCase.execute({
        breakfast: BreakfastTypes.noBreakfast,
        hotBeverages: { coffee: 7, tea: 2, hotChocolate: 4 },
      });

      expect(footprint).toEqual({ hotBeverages: { coffee: 44.194, tea: 1.043, hotChocolate: 167.942, total: 213.179 }, total: 213.179 });
    });
  });
});
