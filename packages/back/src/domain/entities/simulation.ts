import { BreakfastTypes, CarbonFootprintDto, MilkTypes, SimulationDto } from 'carbon-cut-commons';
import { AlimentationData, BreakfastMilkTypes, BreakfastWithMilkTypes } from '../types/alimentation-types';
import { AlimentationFootprints } from './alimentation-footprints';
import { ColdBeverages } from './cold-beverages';
import { FootprintHelper } from './footprints-helper';
import { HotBeverages } from './hot-beverages';
import { Meals } from './meals';
import { ValidationError } from './validation-error';

export class Simulation {
  readonly #breakfast: BreakfastTypes;
  readonly #hotBeverages: HotBeverages;
  readonly #coldBeverages: ColdBeverages;
  readonly #meals: Meals;
  readonly #milkType?: MilkTypes;
  readonly #breakfastsWithMilkMapping: Record<MilkTypes, BreakfastMilkTypes> = {
    [MilkTypes.cowMilk]: 'cowMilkCerealBreakfast',
    [MilkTypes.sojaMilk]: 'sojaMilkCerealBreakfast',
    [MilkTypes.oatsMilk]: 'oatsMilkCerealBreakfast',
  };

  constructor(simulationDto: SimulationDto, alimentationData: AlimentationData) {
    const alimentationFootprints = new AlimentationFootprints();
    const { breakfast, hotBeverages, coldBeverages, milkType, meals } = simulationDto;
    this.#breakfast = breakfast;
    this.#hotBeverages = new HotBeverages(alimentationFootprints, alimentationData, hotBeverages, milkType);
    this.#coldBeverages = new ColdBeverages(alimentationFootprints, alimentationData, coldBeverages);
    this.#meals = new Meals(alimentationFootprints, alimentationData, meals);
    this.#milkType = milkType;
    this.#validate();
  }

  calculate(alimentationData: AlimentationData): CarbonFootprintDto {
    const breakfast = FootprintHelper.getYearlyFootprint(alimentationData.footprints[this.#getBreakfastType()]);
    const hotBeverages = this.#hotBeverages.calculateYearlyFootprint();
    const coldBeverages = this.#coldBeverages.calculateYearlyFootprint();
    const meals = this.#meals.calculateYearlyFootprint();
    const total = this.#getTotal([breakfast], [hotBeverages?.total, coldBeverages?.total, meals?.total]);

    return { ...FootprintHelper.removeNullOrZeroValues({ breakfast, hotBeverages, coldBeverages, meals }), total };
  }

  #validate(): void {
    if (this.#breakfast === BreakfastTypes.milkCerealBreakfast && !this.#milkType) {
      throw new ValidationError(['Milk type should not be empty with cereal milk breakfast']);
    }
  }

  #getBreakfastType(): BreakfastWithMilkTypes {
    if (this.#breakfast !== BreakfastTypes.milkCerealBreakfast) {
      return this.#breakfast;
    }
    return this.#breakfastsWithMilkMapping[this.#milkType];
  }

  #getTotal(numbers: number[], nullableNumbers: Array<number | undefined>): number {
    const cleanedNullableNumbers = nullableNumbers.filter((number) => !isNaN(number));
    return [...numbers, ...cleanedNullableNumbers].reduce((acc, val) => acc + val, 0);
  }
}
