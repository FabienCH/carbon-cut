import { HotBeveragesAnswer, HotBeveragesFootprints, MilkTypes } from 'carbon-cut-commons';
import { FootprintHelper } from './footprints-helper';
import { AlimentationData } from './simulation-data';

export class HotBeverages {
  error: string;

  constructor(private readonly hotBeverages: HotBeveragesAnswer, private readonly milkType: MilkTypes) {}

  calculateYearlyFootprint(alimentationData: AlimentationData): HotBeveragesFootprints {
    const hotBeveragesFootprint = this.#getYearlyHotBeveragesFootprint(alimentationData);
    const totalHotBeverages = FootprintHelper.getTotalFromObject(hotBeveragesFootprint);
    return FootprintHelper.removeNullOrZeroValues({ ...hotBeveragesFootprint, total: totalHotBeverages });
  }

  isValid(): boolean {
    if (this.hotBeverages.hotChocolate > 0 && !this.milkType) {
      this.error = 'Milk type is mandatory with hot chocolate beverage';
      return false;
    }
    return true;
  }

  #getYearlyHotBeveragesFootprint(alimentationData: AlimentationData): Partial<HotBeveragesAnswer> {
    const weeklyCoffeeFootprint =
      this.hotBeverages.coffee * alimentationData.footprints.groundedCoffee * alimentationData.quantities.coffeePerCup;
    const weeklyTeaFootprint = this.hotBeverages.tea * alimentationData.footprints.infusedTea * alimentationData.quantities.teaPerCup;
    const weeklyHotChocolateFootprint =
      this.hotBeverages.hotChocolate *
      (alimentationData.footprints.cacaoPowder * alimentationData.quantities.cacaoPerCup +
        alimentationData.footprints[this.milkType] * alimentationData.quantities.milkPerCup);

    return FootprintHelper.removeNullOrZeroValues({
      coffee: FootprintHelper.getYearlyFootprint(weeklyCoffeeFootprint / 7),
      tea: FootprintHelper.getYearlyFootprint(weeklyTeaFootprint / 7),
      hotChocolate: FootprintHelper.getYearlyFootprint(weeklyHotChocolateFootprint / 7),
    });
  }
}
