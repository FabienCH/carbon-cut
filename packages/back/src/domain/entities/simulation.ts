import { CarbonFootprintDto, SimulationDto } from 'carbon-cut-commons';
import { AlimentationData } from '../types/alimentation-types';
import { AlimentationFootprints } from './alimentation/alimentation-footprints';
import { Breakfast } from './alimentation/breakfast';
import { ColdBeverages } from './alimentation/cold-beverages';
import { HotBeverages } from './alimentation/hot-beverages';
import { Meals } from './alimentation/meals';
import { FootprintHelper } from './footprints-helper';

export class Simulation {
  readonly #breakfast: Breakfast;
  readonly #hotBeverages: HotBeverages;
  readonly #coldBeverages: ColdBeverages;
  readonly #meals: Meals;

  constructor(simulationDto: SimulationDto, alimentationData: AlimentationData) {
    const alimentationFootprints = new AlimentationFootprints();
    const { breakfast, hotBeverages, coldBeverages, milkType, meals } = simulationDto;
    this.#breakfast = new Breakfast(alimentationData, breakfast, milkType);
    this.#hotBeverages = new HotBeverages(alimentationFootprints, alimentationData, hotBeverages, milkType);
    this.#coldBeverages = new ColdBeverages(alimentationFootprints, alimentationData, coldBeverages);
    this.#meals = new Meals(alimentationFootprints, alimentationData, meals);
  }

  calculate(): CarbonFootprintDto {
    const breakfast = this.#breakfast.calculateYearlyFootprint();
    const hotBeverages = this.#hotBeverages.calculateYearlyFootprint();
    const coldBeverages = this.#coldBeverages.calculateYearlyFootprint();
    const meals = this.#meals.calculateYearlyFootprint();
    const total = this.#getTotal([breakfast], [hotBeverages?.total, coldBeverages?.total, meals?.total]);

    return { ...FootprintHelper.removeNullOrZeroValues({ breakfast, hotBeverages, coldBeverages, meals }), total };
  }

  #getTotal(numbers: number[], nullableNumbers: Array<number | undefined>): number {
    const cleanedNullableNumbers = nullableNumbers.filter((number) => !isNaN(number));
    return [...numbers, ...cleanedNullableNumbers].reduce((acc, val) => acc + val, 0);
  }
}
