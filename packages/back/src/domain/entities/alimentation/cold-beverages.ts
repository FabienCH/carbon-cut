import { ColdBeveragesAnswer, ColdBeveragesFootprints } from 'carbon-cut-commons';
import { AlimentationData } from '../../types/alimentation-types';
import { AnswerValidator } from '../answer-validator';
import { FootprintCategory, WithoutTotal } from '../footprint-category';
import { FootprintHelper } from '../footprints-helper';
import { AlimentationFootprints } from './alimentation-footprints';

export class ColdBeverages extends FootprintCategory<ColdBeveragesFootprints> {
  protected readonly hasWeeklyFootprint = true;
  readonly #sweetFootprintValues: number[];
  readonly #alcoholFootprintValues: number[];

  constructor(
    private readonly alimentationFootprints: AlimentationFootprints,
    readonly alimentationData: AlimentationData,
    private readonly coldBeveragesAnswer: ColdBeveragesAnswer,
  ) {
    super(alimentationData);
    AnswerValidator.validatePositiveValues(this.coldBeveragesAnswer, 'coldBeverages');
    const { fruitsJuice, sodas, sirops, beer, wine, cocktail } = this.footprintsData;
    this.#sweetFootprintValues = [fruitsJuice, sodas, sirops];
    this.#alcoholFootprintValues = [beer, wine, cocktail];
  }

  calculateYearlyFootprint(): ColdBeveragesFootprints {
    return FootprintHelper.removeNullishFootprints(this.calculateYearlyFootprintWithTotal());
  }

  protected getYearlyFootprints(): Partial<WithoutTotal<ColdBeveragesFootprints>> {
    const sweetBeveragesFootprint = this.alimentationFootprints.calculateAveragedFootprint(
      this.coldBeveragesAnswer.sweet,
      this.#sweetFootprintValues,
    );
    const alcoholBeveragesFootprint = this.alimentationFootprints.calculateAveragedFootprint(
      this.coldBeveragesAnswer.alcohol,
      this.#alcoholFootprintValues,
    );

    return this.getYearlyNonNullFootprint({ sweet: sweetBeveragesFootprint, alcohol: alcoholBeveragesFootprint });
  }
}
