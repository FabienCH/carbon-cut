import { BreakfastTypes, MilkTypes, SimulationDto } from 'carbon-cut-commons';
import { InMemorySimulationDataRepository } from '../../tests/repositories/in-memory-simulation-data.repository';
import { CalculateCarbonFootprintUseCase } from './calculate-carbon-footprint.usecase';

describe('Carbon footprint calculation use case', () => {
  let calculateCarbonFootprintUseCase: CalculateCarbonFootprintUseCase;
  const defaultSimulationAnswers: SimulationDto = {
    breakfast: BreakfastTypes.noBreakfast,
    hotBeverages: { coffee: 0, tea: 0, hotChocolate: 0 },
    coldBeverages: { sweet: 0, alcohol: 0 },
  };
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
  });

  describe('Simulation validation', () => {
    it('should have a milk type if it has cereal with milk breakfast', async () => {
      await expect(
        calculateCarbonFootprintUseCase.execute({
          ...defaultSimulationAnswers,
          breakfast: BreakfastTypes.milkCerealBreakfast,
        }),
      ).rejects.toThrowError('Milk type is mandatory with cereal milk breakfast');
    });

    it('should have a milk type if it has hot chocolate beverages', async () => {
      await expect(
        calculateCarbonFootprintUseCase.execute({
          ...defaultSimulationAnswers,
          breakfast: BreakfastTypes.britishBreakfast,
          hotBeverages: { ...defaultSimulationAnswers.hotBeverages, hotChocolate: 2 },
        }),
      ).rejects.toThrowError('Milk type is mandatory with hot chocolate beverage');
    });
  });
});
