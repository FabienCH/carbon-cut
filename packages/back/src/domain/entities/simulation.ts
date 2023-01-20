import {
  BreakfastTypes,
  CarbonFootprintDto,
  getTypedObjectKeys,
  HotBeverages,
  MilkTypes,
  NumberFormatter,
  SimulationDto,
} from 'carbon-cut-commons';
import { ColdBeverages } from 'carbon-cut-commons/dist/types/beverages';
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
  error: string;

  constructor(simulationDto: SimulationDto) {
    const { breakfast, hotBeverages, coldBeverages, milkType } = simulationDto;
    this.#breakfast = breakfast;
    this.#hotBeverages = hotBeverages;
    this.#coldBeverages = coldBeverages;
    this.#milkType = milkType;
  }

  calculate(alimentationData: AlimentationData): CarbonFootprintDto {
    const breakfast = this.#getYearlyFootprint(alimentationData.footprints[this.#getBreakfastType()]);
    const hotBeveragesFootprint = this.#getYearlyHotBeveragesFootprint(alimentationData);
    const totalHotBeverages = this.#getTotalFromObject(hotBeveragesFootprint);
    const hotBeverages = this.#removeNullOrZeroValues({ ...hotBeveragesFootprint, total: totalHotBeverages });

    const coldBeveragesFootprint = this.#getYearlyColdBeveragesFootprint(alimentationData);
    const totalColdBeverages = this.#getTotalFromObject(coldBeveragesFootprint);
    const coldBeverages = this.#removeNullOrZeroValues({ ...coldBeveragesFootprint, total: totalColdBeverages });
    const total = breakfast + totalHotBeverages + totalColdBeverages;

    return { ...this.#removeNullOrZeroValues({ breakfast, hotBeverages, coldBeverages }), total };
  }

  isValid(): boolean {
    const mustHaveMilkType = this.#breakfast === BreakfastTypes.milkCerealBreakfast || this.#hotBeverages.hotChocolate > 0;
    if (mustHaveMilkType && !this.#milkType) {
      this.error = 'Milk type is mandatory with cereal milk breakfast and hot chocolate beverage';
      return false;
    }
    return true;
  }

  #getBreakfastType(): BreakfastWithMilkTypes {
    if (this.#breakfast !== BreakfastTypes.milkCerealBreakfast) {
      return this.#breakfast;
    }
    return this.#breakfastsWithMilkMapping[this.#milkType];
  }

  #getYearlyHotBeveragesFootprint(alimentationData: AlimentationData): Partial<HotBeverages> {
    const weeklyCoffeeFootprint =
      this.#hotBeverages.coffee * alimentationData.footprints.groundedCoffee * alimentationData.quantities.coffeePerCup;
    const weeklyTeaFootprint = this.#hotBeverages.tea * alimentationData.footprints.infusedTea * alimentationData.quantities.teaPerCup;
    const weeklyHotChocolateFootprint =
      this.#hotBeverages.hotChocolate *
      (alimentationData.footprints.cacaoPowder * alimentationData.quantities.cacaoPerCup +
        alimentationData.footprints[this.#milkType] * alimentationData.quantities.milkPerCup);
    const beverages = {
      coffee: this.#getYearlyFootprint(weeklyCoffeeFootprint / 7),
      tea: this.#getYearlyFootprint(weeklyTeaFootprint / 7),
      hotChocolate: this.#getYearlyFootprint(weeklyHotChocolateFootprint / 7),
    };
    return this.#removeNullOrZeroValues(beverages);
  }

  #getYearlyColdBeveragesFootprint(alimentationData: AlimentationData): Partial<ColdBeverages> {
    const weeklySweetBeveragesFootprint =
      (this.#coldBeverages.sweet *
        (alimentationData.footprints.fruitsJuice + alimentationData.footprints.sodas + alimentationData.footprints.sirops)) /
      3;

    const beverages = {
      sweet: this.#getYearlyFootprint(weeklySweetBeveragesFootprint / 7),
    };
    return this.#removeNullOrZeroValues(beverages);
  }

  #removeNullOrZeroValues<T extends object>(object: T): Partial<T> {
    return getTypedObjectKeys(object).reduce((partialObject: Partial<T>, key) => {
      const value = object[key];
      if (value) {
        partialObject = { ...(partialObject ?? {}), [key]: value };
      }
      return partialObject;
    }, undefined);
  }

  #getTotalFromObject(object: Record<string, number>): number {
    if (!object) {
      return 0;
    }
    return NumberFormatter.roundNumber(
      Object.values(object).reduce((acc, val) => acc + val, 0),
      3,
    );
  }

  #getYearlyFootprint(dailyFootprint: number): number {
    return NumberFormatter.roundNumber(dailyFootprint * 365, 3);
  }
}
