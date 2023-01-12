import { Beverages, BreakfastTypes, CarbonFootprintDto, NumberFormatter, SimulationDto } from 'carbon-cut-commons';
import { AlimentationData } from './simulation-data';
import { getTypedObjectKeys } from './typed-object-keys';

export class Simulation {
  readonly #breakfast: BreakfastTypes;
  readonly #beverages: Beverages;

  constructor(simulationDto: SimulationDto) {
    const { breakfast, beverages } = simulationDto;
    this.#breakfast = breakfast;
    this.#beverages = beverages;
  }

  calculate(alimentationData: AlimentationData): CarbonFootprintDto {
    const breakfast = this.#getYearlyFootprint(alimentationData.footprints[this.#breakfast]);
    const beverages = this.#getYearlyBeveragesFootprint(alimentationData);
    const total = breakfast + this.#getTotalFromObject(beverages);
    return { ...this.#removeNullOrZeroValues({ breakfast, beverages }), total };
  }

  #getYearlyBeveragesFootprint(alimentationData: AlimentationData): Partial<Beverages> {
    const weeklyCoffeeFootprint =
      this.#beverages.coffee * alimentationData.footprints.groundedCoffee * alimentationData.quantities.coffeePerCup;
    const weeklyTeaFootprint = this.#beverages.tea * alimentationData.footprints.infusedTea * alimentationData.quantities.teaPerCup;
    const weeklyHotChocolateFootprint =
      this.#beverages.hotChocolate *
      (alimentationData.footprints.cacaoPowder * alimentationData.quantities.cacaoPerCup +
        alimentationData.footprints.cowMilk * alimentationData.quantities.milkPerCup);
    const beverages = {
      coffee: this.#getYearlyFootprint(weeklyCoffeeFootprint / 7),
      tea: this.#getYearlyFootprint(weeklyTeaFootprint / 7),
      hotChocolate: this.#getYearlyFootprint(weeklyHotChocolateFootprint / 7),
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
    return Object.values(object).reduce((acc, val) => acc + val, 0);
  }

  #getYearlyFootprint(dailyFootprint: number): number {
    return NumberFormatter.roundNumber(dailyFootprint * 365, 3);
  }
}
