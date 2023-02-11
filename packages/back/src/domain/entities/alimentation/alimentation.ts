import { AlimentationDto, AlimentationFootprintDto, NumberFormatter } from 'carbon-cut-commons';
import { AlimentationData } from '../../types/alimentation-types';
import { FootprintHelper } from '../footprints-helper';
import { AlimentationFootprints } from './alimentation-footprints';
import { Breakfast } from './breakfast';
import { ColdBeverages } from './cold-beverages';
import { HotBeverages } from './hot-beverages';
import { Meals } from './meals';

export class Alimentation {
  readonly #breakfast: Breakfast;
  readonly #hotBeverages: HotBeverages;
  readonly #coldBeverages: ColdBeverages;
  readonly #meals: Meals;

  constructor(alimentationDto: AlimentationDto, alimentationData: AlimentationData) {
    const alimentationFootprints = new AlimentationFootprints();
    const { breakfast, hotBeverages, coldBeverages, milkType, meals } = alimentationDto;
    this.#breakfast = new Breakfast(alimentationData, breakfast, milkType);
    this.#hotBeverages = new HotBeverages(alimentationFootprints, alimentationData, hotBeverages, milkType);
    this.#coldBeverages = new ColdBeverages(alimentationFootprints, alimentationData, coldBeverages);
    this.#meals = new Meals(alimentationFootprints, alimentationData, meals);
  }

  calculateYearlyFootprint(): AlimentationFootprintDto {
    const breakfast = this.#breakfast.calculateYearlyFootprint();
    const hotBeverages = this.#hotBeverages.calculateYearlyFootprint();
    const coldBeverages = this.#coldBeverages.calculateYearlyFootprint();
    const meals = this.#meals.calculateYearlyFootprint();
    const total = this.#getTotal([breakfast], [hotBeverages?.total, coldBeverages?.total, meals.total]);

    return { ...FootprintHelper.removeNullishFootprints({ breakfast, hotBeverages, coldBeverages }), meals, total };
  }

  #getTotal(numbers: number[], nullableNumbers: Array<number | undefined>): number {
    const cleanedNullableNumbers = nullableNumbers.filter((number) => !isNaN(number));
    return NumberFormatter.roundNumber(
      [...numbers, ...cleanedNullableNumbers].reduce((acc, val) => acc + val, 0),
      3,
    );
  }
}
