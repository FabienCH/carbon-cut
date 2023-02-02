import { ColdBeveragesAnswer, ColdBeveragesFootprints } from 'carbon-cut-commons';
import { AlimentationData } from '../../types/alimentation-types';
import { AnswerValidator } from '../answer-validator';
import { FootprintCategory } from '../footprint-category';
import { AlimentationFootprints } from './alimentation-footprints';

export class ColdBeverages extends FootprintCategory {
  protected readonly hasWeeklyFootprint = true;
  readonly #sweetFootprintValues: number[];
  readonly #alcoholFootprintValues: number[];

  constructor(
    private readonly alimentationFootprints: AlimentationFootprints,
    readonly alimentationData: AlimentationData,
    private readonly coldBeverages: ColdBeveragesAnswer,
  ) {
    super(alimentationData);
    AnswerValidator.validatePositiveValues(this.coldBeverages, 'coldBeverages');
    const { fruitsJuice, sodas, sirops, beer, wine, cocktail } = this.footprintsData;
    this.#sweetFootprintValues = [fruitsJuice, sodas, sirops];
    this.#alcoholFootprintValues = [beer, wine, cocktail];
  }

  protected getYearlyFootprints(): Partial<ColdBeveragesFootprints> {
    const sweetBeveragesFootprint = this.alimentationFootprints.calculateAveragedFootprint(
      this.coldBeverages.sweet,
      this.#sweetFootprintValues,
    );
    const alcoholBeveragesFootprint = this.alimentationFootprints.calculateAveragedFootprint(
      this.coldBeverages.alcohol,
      this.#alcoholFootprintValues,
    );

    return this.getYearlyNonNullFootprint({ sweet: sweetBeveragesFootprint, alcohol: alcoholBeveragesFootprint });
  }
}
