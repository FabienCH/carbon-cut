import { HotBeveragesAnswer, HotBeveragesFootprints, MilkTypes } from 'carbon-cut-commons';
import { AlimentationData } from '../types/alimentation-types';
import { AlimentationFootprintData, AlimentationFootprints } from './alimentation-footprints';
import { AnswerValidator } from './answer-validator';
import { FootprintCategory } from './footprint-category';
import { ValidationError } from './validation-error';

export class HotBeverages extends FootprintCategory {
  protected readonly hasWeeklyFootprint = true;
  readonly #coffeeFootprintData: AlimentationFootprintData = {
    footprintValue: this.footprintsData.groundedCoffee,
    quantityMultiplier: this.quantitiesData.coffeePerCup,
  };
  readonly #teaFootprintData: AlimentationFootprintData = {
    footprintValue: this.footprintsData.infusedTea,
    quantityMultiplier: this.quantitiesData.teaPerCup,
  };
  readonly #hotChocolateFootprintData: AlimentationFootprintData[] = [
    {
      footprintValue: this.footprintsData.cacaoPowder,
      quantityMultiplier: this.quantitiesData.cacaoPerCup,
    },
    {
      footprintValue: this.footprintsData[this.milkType],
      quantityMultiplier: this.quantitiesData.milkPerCup,
    },
  ];

  constructor(
    private readonly alimentationFootprints: AlimentationFootprints,
    readonly alimentationData: AlimentationData,
    private readonly hotBeveragesAnswer: HotBeveragesAnswer,
    private readonly milkType: MilkTypes,
  ) {
    super(alimentationData);
    this.#validate();
  }

  protected getYearlyFootprints(): Partial<HotBeveragesFootprints> {
    const coffeeFootprint = this.alimentationFootprints.calculateFootprint(this.hotBeveragesAnswer.coffee, this.#coffeeFootprintData);
    const teaFootprint = this.alimentationFootprints.calculateFootprint(this.hotBeveragesAnswer.tea, this.#teaFootprintData);
    const hotChocolateFootprint = this.alimentationFootprints.calculateMultipleIngredientsFootprint(
      this.hotBeveragesAnswer.hotChocolate,
      this.#hotChocolateFootprintData,
    );

    return this.getYearlyNonNullFootprint({ coffee: coffeeFootprint, tea: teaFootprint, hotChocolate: hotChocolateFootprint });
  }

  #validate(): void {
    AnswerValidator.validatePositiveValues(this.hotBeveragesAnswer, 'hotBeverages');

    if (this.hotBeveragesAnswer.hotChocolate > 0 && !this.milkType) {
      throw new ValidationError(['Milk type should not be empty with hot chocolate beverage']);
    }
  }
}
