import { MealsAnswer, MealsFootprints } from 'carbon-cut-commons';
import { AlimentationData } from '../types/alimentation-types';
import { AlimentationFootprintData, AlimentationFootprints } from './alimentation-footprints';
import { AnswerValidator } from './answer-validator';
import { FootprintCategory } from './footprint-category';
import { ValidationError } from './validation-error';

export class Meals extends FootprintCategory {
  protected readonly hasWeeklyFootprint = false;
  readonly #mealsInAWeek = 14;
  readonly #veganFootprintData: AlimentationFootprintData = {
    footprintValue: this.footprintsData.veganMeal,
  };
  readonly #vegetarianFootprintData: AlimentationFootprintData = {
    footprintValue: this.footprintsData.vegetarianMeal,
  };
  readonly #whiteMeatFootprintData: AlimentationFootprintData = {
    footprintValue: this.footprintsData.whiteMeatMeal,
  };
  readonly #redMeatFootprintData: AlimentationFootprintData = {
    footprintValue: this.footprintsData.redMeatMeal,
  };
  readonly #whiteFishFootprintData: AlimentationFootprintData = {
    footprintValue: this.footprintsData.whiteFishMeal,
  };
  readonly #fishFootprintData: AlimentationFootprintData = {
    footprintValue: this.footprintsData.fishMeal,
  };
  constructor(
    private readonly alimentationFootprints: AlimentationFootprints,
    readonly alimentationData: AlimentationData,
    private readonly meals: MealsAnswer,
  ) {
    super(alimentationData);
    this.#validate();
  }

  protected getYearlyFootprints(): Partial<MealsFootprints> {
    const veganFootprint = this.alimentationFootprints.calculateFootprint(this.meals.vegan, this.#veganFootprintData);
    const vegetarianFootprint = this.alimentationFootprints.calculateFootprint(this.meals.vegetarian, this.#vegetarianFootprintData);
    const whiteMeatFootprint = this.alimentationFootprints.calculateFootprint(this.meals.whiteMeat, this.#whiteMeatFootprintData);
    const redMeatFootprint = this.alimentationFootprints.calculateFootprint(this.meals.redMeat, this.#redMeatFootprintData);
    const whiteFishFootprint = this.alimentationFootprints.calculateFootprint(this.meals.whiteFish, this.#whiteFishFootprintData);
    const fishFootprint = this.alimentationFootprints.calculateFootprint(this.meals.fish, this.#fishFootprintData);

    return this.getYearlyNonNullFootprint({
      vegan: veganFootprint,
      vegetarian: vegetarianFootprint,
      whiteMeat: whiteMeatFootprint,
      redMeat: redMeatFootprint,
      whiteFish: whiteFishFootprint,
      fish: fishFootprint,
    });
  }

  #validate(): void {
    AnswerValidator.validatePositiveValues(this.meals, 'meals');

    const numberOfMeals = Object.values(this.meals).reduce((count, meal) => (count += meal), 0);
    if (numberOfMeals !== this.#mealsInAWeek) {
      throw new ValidationError(['The number of meals must be 14']);
    }
  }
}
