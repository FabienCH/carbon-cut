import { ColdBeveragesAnswer, ColdBeveragesFootprints } from 'carbon-cut-commons';
import { AnswerValidator } from './answer-validator';
import { FootprintHelper } from './footprints-helper';
import { AlimentationData } from './simulation-data';

export class ColdBeverages {
  constructor(private readonly coldBeverages: ColdBeveragesAnswer) {
    AnswerValidator.validatePositiveValues(this.coldBeverages, 'coldBeverages');
  }

  calculateYearlyFootprint(alimentationData: AlimentationData): ColdBeveragesFootprints {
    const coldBeveragesFootprint = this.#getYearlyColdBeveragesFootprint(alimentationData);
    const totalColdBeverages = FootprintHelper.getTotalFromObject(coldBeveragesFootprint);
    return FootprintHelper.removeNullOrZeroValues({ ...coldBeveragesFootprint, total: totalColdBeverages });
  }

  #getYearlyColdBeveragesFootprint(alimentationData: AlimentationData): Partial<ColdBeveragesAnswer> {
    const weeklySweetBeveragesFootprint =
      (this.coldBeverages.sweet *
        (alimentationData.footprints.fruitsJuice + alimentationData.footprints.sodas + alimentationData.footprints.sirops)) /
      3;

    const weeklyAlcoholFootprint =
      (this.coldBeverages.alcohol *
        (alimentationData.footprints.beer + alimentationData.footprints.wine + alimentationData.footprints.cocktail)) /
      3;

    return FootprintHelper.removeNullOrZeroValues({
      sweet: FootprintHelper.getYearlyFootprint(weeklySweetBeveragesFootprint / 7),
      alcohol: FootprintHelper.getYearlyFootprint(weeklyAlcoholFootprint / 7),
    });
  }
}