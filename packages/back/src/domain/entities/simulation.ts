import { BreakfastTypes, CarbonFootprintDto, MilkTypes, SimulationDto } from 'carbon-cut-commons';
import { ColdBeverages } from './cold-beverages';
import { FootprintHelper } from './footprints-helper';
import { HotBeverages } from './hot-beverages';
import { AlimentationData, BreakfastMilkTypes, BreakfastWithMilkTypes } from './simulation-data';

export class Simulation {
  readonly #breakfast: BreakfastTypes;
  readonly #hotBeverages: HotBeverages;
  readonly #coldBeverages: ColdBeverages;
  readonly #milkType?: MilkTypes;
  readonly #breakfastsWithMilkMapping: Record<MilkTypes, BreakfastMilkTypes> = {
    [MilkTypes.cowMilk]: 'cowMilkCerealBreakfast',
    [MilkTypes.sojaMilk]: 'sojaMilkCerealBreakfast',
    [MilkTypes.oatsMilk]: 'oatsMilkCerealBreakfast',
  };

  constructor(simulationDto: SimulationDto) {
    const { breakfast, hotBeverages, coldBeverages, milkType } = simulationDto;
    this.#breakfast = breakfast;
    this.#hotBeverages = new HotBeverages(hotBeverages, milkType);
    this.#coldBeverages = new ColdBeverages(coldBeverages);
    this.#milkType = milkType;
    this.#validate();
  }

  calculate(alimentationData: AlimentationData): CarbonFootprintDto {
    const breakfast = FootprintHelper.getYearlyFootprint(alimentationData.footprints[this.#getBreakfastType()]);
    const hotBeverages = this.#hotBeverages.calculateYearlyFootprint(alimentationData);
    const coldBeverages = this.#coldBeverages.calculateYearlyFootprint(alimentationData);
    const total = this.#getTotal([breakfast], [hotBeverages?.total, coldBeverages?.total]);

    return { ...FootprintHelper.removeNullOrZeroValues({ breakfast, hotBeverages, coldBeverages }), total };
  }

  #validate(): void {
    if (this.#breakfast === BreakfastTypes.milkCerealBreakfast && !this.#milkType) {
      throw new Error('Milk type should not be empty with cereal milk breakfast');
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
