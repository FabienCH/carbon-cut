import { AlimentationData } from '../../domain/entities/simulation-data';
import { SimulationDataRepository } from '../../domain/ports/repositories/simulation-data.repository';

export class InMemorySimulationDataRepository implements SimulationDataRepository {
  simulationData: AlimentationData;

  constructor(initData = false) {
    if (initData) {
      this.simulationData = {
        quantities: {
          coffeePerCup: 0.012,
          teaPerCup: 0.25,
          cacaoPerCup: 0.02,
          milkPerCup: 0.2,
        },
        footprints: {
          groundedCoffee: 10.09,
          infusedTea: 0.04,
          cacaoPowder: 27.06,
          cowMilk: 1.32,
          sojaMilk: 0.44,
          oatsMilk: 0.54,
          waterBottle: 0.27,
          sodas: 0.51,
          fruitsJuice: 0.91,
          sirops: 0.1,
          beer: 1.12,
          wine: 1.22,
          cocktail: 0.91,
          veganMeal: 0.785,
          vegetarianMeal: 1.115,
          whiteMeatMeal: 2.098,
          redMeatMeal: 5.51,
          fishMeal: 1.63,
          whiteFishMeal: 2.368,
          continentalBreakfast: 0.289,
          cowMilkCerealBreakfast: 0.468,
          sojaMilkCerealBreakfast: 0.292,
          oatsMilkCerealBreakfast: 0.312,
          britishBreakfast: 1.124,
          veganBreakfast: 0.419,
          noBreakfast: 0,
        },
        multipliers: {
          localFoodReductionPercent: {
            always: 1,
            often: 0.666,
            sometimes: 0.333,
          },
          localMealReductionPercent: {
            vegan: 0.12,
            vegetarian: 0.08,
            whiteMeat: 0.03,
            redMeat: 0.01,
            fish: 0.05,
            whiteFish: 0.06,
            breakfast: 0.08,
          },
          seasonMealReductionPercent: {
            always: 1,
            often: 0.666,
            sometimes: 0.333,
          },
          seasonMealRatio: {
            always: 1,
            often: 0.666,
            sometimes: 0.333,
          },
          seasonablePercent: 0.073,
          teaHeatingPercent: 0.25,
        },
      };
    }
  }

  async insert(simulationData: AlimentationData): Promise<void> {
    this.simulationData = simulationData;
    return;
  }

  async get(): Promise<AlimentationData> {
    return this.simulationData;
  }
}
