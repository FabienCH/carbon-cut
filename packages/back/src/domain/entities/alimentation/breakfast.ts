import { BreakfastTypes, MilkTypes } from 'carbon-cut-commons';
import { AlimentationData, BreakfastMilkTypes, BreakfastWithMilkTypes } from '../../types/alimentation-types';
import { FootprintHelper } from '../footprints-helper';
import { ValidationError } from '../validation-error';

export class Breakfast {
  readonly #breakfastsWithMilkMapping: Record<MilkTypes, BreakfastMilkTypes> = {
    [MilkTypes.cowMilk]: 'cowMilkCerealBreakfast',
    [MilkTypes.sojaMilk]: 'sojaMilkCerealBreakfast',
    [MilkTypes.oatsMilk]: 'oatsMilkCerealBreakfast',
  };

  constructor(
    readonly alimentationData: AlimentationData,
    private readonly breakfastType: BreakfastTypes,
    private readonly milkType: MilkTypes,
  ) {
    this.#validate();
  }

  calculateYearlyFootprint(): number {
    return FootprintHelper.getYearlyFootprint(this.alimentationData.footprints[this.#getBreakfastType()]);
  }

  #validate(): void {
    if (this.breakfastType === BreakfastTypes.milkCerealBreakfast && !this.milkType) {
      throw new ValidationError(['Milk type should not be empty with cereal milk breakfast']);
    }
  }

  #getBreakfastType(): BreakfastWithMilkTypes {
    if (this.breakfastType !== BreakfastTypes.milkCerealBreakfast) {
      return this.breakfastType;
    }
    return this.#breakfastsWithMilkMapping[this.milkType];
  }
}
