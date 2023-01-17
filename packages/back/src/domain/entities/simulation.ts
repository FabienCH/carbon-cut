import { BreakfastTypes, CarbonFootprintDto, getTypedObjectKeys, HotBeverages, NumberFormatter, SimulationDto } from 'carbon-cut-commons';
import { AlimentationData } from './simulation-data';

export class Simulation {
  readonly #breakfast: BreakfastTypes;
  readonly #hotBeverages: HotBeverages;

  constructor(simulationDto: SimulationDto) {
    const { breakfast, hotBeverages } = simulationDto;
    this.#breakfast = breakfast;
    this.#hotBeverages = hotBeverages;
  }

  calculate(alimentationData: AlimentationData): CarbonFootprintDto {
    const breakfast = this.#getYearlyFootprint(alimentationData.footprints[this.#breakfast]);
    const hotBeveragesFootprint = this.#getYearlyBeveragesFootprint(alimentationData);
    const totalHotBeverages = this.#getTotalFromObject(hotBeveragesFootprint);
    const hotBeverages = this.#removeNullOrZeroValues({ ...hotBeveragesFootprint, total: totalHotBeverages });
    const total = breakfast + totalHotBeverages;
    return { ...this.#removeNullOrZeroValues({ breakfast, hotBeverages }), total };
  }

  #getYearlyBeveragesFootprint(alimentationData: AlimentationData): Partial<HotBeverages> {
    const weeklyCoffeeFootprint =
      this.#hotBeverages.coffee * alimentationData.footprints.groundedCoffee * alimentationData.quantities.coffeePerCup;
    const weeklyTeaFootprint = this.#hotBeverages.tea * alimentationData.footprints.infusedTea * alimentationData.quantities.teaPerCup;
    const weeklyHotChocolateFootprint =
      this.#hotBeverages.hotChocolate *
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
    return NumberFormatter.roundNumber(
      Object.values(object).reduce((acc, val) => acc + val, 0),
      3,
    );
  }

  #getYearlyFootprint(dailyFootprint: number): number {
    return NumberFormatter.roundNumber(dailyFootprint * 365, 3);
  }
}
