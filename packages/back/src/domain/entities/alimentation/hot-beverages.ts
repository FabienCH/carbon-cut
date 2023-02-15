import { HotBeveragesAnswer, HotBeveragesFootprints, MilkTypes } from 'carbon-cut-commons';
import { AlimentationData } from '../../types/alimentation-types';
import { AnswerValidator } from '../answer-validator';
import { FootprintsCategory } from '../footprint-category';
import { FootprintHelper } from '../footprints-helper';
import { ValidationError } from '../validation-error';
import { AlimentationFootprintData, AlimentationFootprints } from './alimentation-footprints';

export class HotBeverages extends FootprintsCategory<HotBeveragesFootprints, AlimentationData> {
  readonly #hotChocolateFootprintData: AlimentationFootprintData[] = [
    {
      footprintValue: this.footprintsData.cacaoPowder,
      quantityMultiplier: this.quantitiesData.cacaoPerCup,
    },
    {
      footprintValue: this.milkType ? this.footprintsData[this.milkType] : 0,
      quantityMultiplier: this.quantitiesData.milkPerCup,
    },
  ];

  constructor(
    private readonly alimentationFootprints: AlimentationFootprints,
    readonly alimentationData: AlimentationData,
    private readonly hotBeveragesAnswer: HotBeveragesAnswer,
    private readonly milkType?: MilkTypes,
  ) {
    super(alimentationData);
    this.#validate();
  }

  calculateYearlyFootprint(): HotBeveragesFootprints {
    return FootprintHelper.removeNullishFootprints(this.calculateYearlyFootprintWithTotal());
  }

  protected getYearlyFootprints(): Partial<HotBeveragesFootprints> {
    const { groundedCoffee, infusedTea } = this.footprintsData;
    const { coffeePerCup, teaPerCup } = this.quantitiesData;
    const coffeeFootprint = this.alimentationFootprints.calculateFootprint(this.hotBeveragesAnswer.coffee, groundedCoffee, coffeePerCup);
    const teaFootprint = this.alimentationFootprints.calculateFootprint(this.hotBeveragesAnswer.tea, infusedTea, teaPerCup);
    const hotChocolateFootprint = this.alimentationFootprints.calculateMultipleIngredientsFootprint(
      this.hotBeveragesAnswer.hotChocolate,
      this.#hotChocolateFootprintData,
    );

    return { coffee: coffeeFootprint, tea: teaFootprint, hotChocolate: hotChocolateFootprint };
  }

  #validate(): void {
    AnswerValidator.validatePositiveValues(this.hotBeveragesAnswer, 'hotBeverages');

    if (this.hotBeveragesAnswer.hotChocolate > 0 && !this.milkType) {
      throw new ValidationError(['Milk type should not be empty with hot chocolate beverage']);
    }
  }
}
