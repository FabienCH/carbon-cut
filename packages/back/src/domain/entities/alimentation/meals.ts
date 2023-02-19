import { MealsAnswer, MealsFootprints } from 'carbon-cut-commons';
import { AlimentationData } from '../../types/alimentation-types';
import { AnswerValidator } from '../answer-validator';
import { FootprintsCategory, WithoutTotal } from '../footprint-category';
import { FootprintHelper } from '../footprints-helper';
import { ValidationError } from '../validation-error';
import { AlimentationFootprints } from './alimentation-footprints';

export class Meals extends FootprintsCategory<MealsFootprints, AlimentationData> {
  constructor(
    private readonly alimentationFootprints: AlimentationFootprints,
    readonly alimentationData: AlimentationData,
    private readonly mealsAnswer: MealsAnswer,
  ) {
    super(alimentationData);
    this.#validate();
  }

  calculateYearlyFootprint(): MealsFootprints {
    const { total, ...footprints } = this.calculateYearlyFootprintWithTotal();
    return { ...FootprintHelper.removeNullishFootprints(footprints), total };
  }

  protected getYearlyFootprints(): WithoutTotal<MealsFootprints> {
    const { veganMeal, vegetarianMeal, whiteMeatMeal, redMeatMeal, whiteFishMeal, fishMeal } = this.footprintsData;
    const veganFootprint = this.alimentationFootprints.calculateFootprint(this.mealsAnswer.vegan, veganMeal);
    const vegetarianFootprint = this.alimentationFootprints.calculateFootprint(this.mealsAnswer.vegetarian, vegetarianMeal);
    const whiteMeatFootprint = this.alimentationFootprints.calculateFootprint(this.mealsAnswer.whiteMeat, whiteMeatMeal);
    const redMeatFootprint = this.alimentationFootprints.calculateFootprint(this.mealsAnswer.redMeat, redMeatMeal);
    const whiteFishFootprint = this.alimentationFootprints.calculateFootprint(this.mealsAnswer.whiteFish, whiteFishMeal);
    const fishFootprint = this.alimentationFootprints.calculateFootprint(this.mealsAnswer.fish, fishMeal);

    return {
      vegan: veganFootprint,
      vegetarian: vegetarianFootprint,
      whiteMeat: whiteMeatFootprint,
      redMeat: redMeatFootprint,
      whiteFish: whiteFishFootprint,
      fish: fishFootprint,
    };
  }

  #validate(): void {
    AnswerValidator.validatePositiveValues(this.mealsAnswer, 'meals');

    const mealsInAWeek = 14;
    const numberOfMeals = Object.values(this.mealsAnswer).reduce((count, meal) => (count += meal), 0);
    if (numberOfMeals !== mealsInAWeek) {
      throw new ValidationError([`The number of meals must be 14, ${numberOfMeals} given`]);
    }
  }
}
