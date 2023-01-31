import { HotBeveragesAnswer, HotBeveragesFootprints, MilkTypes } from 'carbon-cut-commons';
import { AnswerValidator } from './answer-validator';
import { FootprintHelper } from './footprints-helper';
import { AlimentationData } from './simulation-data';
import { ValidationError } from './validation-error';

export class HotBeverages {
  constructor(private readonly hotBeverages: HotBeveragesAnswer, private readonly milkType: MilkTypes) {
    this.#validate();
  }

  calculateYearlyFootprint(alimentationData: AlimentationData): HotBeveragesFootprints {
    const hotBeveragesFootprint = this.#getYearlyHotBeveragesFootprint(alimentationData);
    const totalHotBeverages = FootprintHelper.getTotalFromObject(hotBeveragesFootprint);
    return FootprintHelper.removeNullOrZeroValues({ ...hotBeveragesFootprint, total: totalHotBeverages });
  }

  #validate(): void {
    AnswerValidator.validatePositiveValues(this.hotBeverages, 'hotBeverages');

    if (this.hotBeverages.hotChocolate > 0 && !this.milkType) {
      throw new ValidationError(['Milk type should not be empty with hot chocolate beverage']);
    }
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
