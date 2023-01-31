import { MealsFootprints } from 'carbon-cut-commons/dist/types/dtos/meals-dto';
import { MealsAnswer } from 'carbon-cut-commons/dist/types/meals';
import { AnswerValidator } from './answer-validator';
import { FootprintHelper } from './footprints-helper';
import { AlimentationData } from './simulation-data';

export class Meals {
  constructor(private readonly meals: MealsAnswer) {
    AnswerValidator.validatePositiveValues(this.meals, 'meals');
  }

  calculateYearlyFootprint(alimentationData: AlimentationData): MealsFootprints {
    const mealsFootprint = this.#getYearlyMealsFootprint(alimentationData);
    const totalMeals = FootprintHelper.getTotalFromObject(mealsFootprint);
    return FootprintHelper.removeNullOrZeroValues({ ...mealsFootprint, total: totalMeals });
  }

  #getYearlyMealsFootprint(alimentationData: AlimentationData): Partial<MealsAnswer> {
    const veganFootprint = this.meals.vegan * alimentationData.footprints.veganMeal;
    const vegetarianFootprint = this.meals.vegetarian * alimentationData.footprints.vegetarianMeal;
    const whiteMeatFootprint = this.meals.whiteMeat * alimentationData.footprints.whiteMeatMeal;
    const redMeatFootprint = this.meals.redMeat * alimentationData.footprints.redMeatMeal;
    const whiteFishFootprint = this.meals.whiteFish * alimentationData.footprints.whiteFishMeal;
    const fishFootprint = this.meals.fish * alimentationData.footprints.fishMeal;

    return FootprintHelper.removeNullOrZeroValues({
      vegan: FootprintHelper.getYearlyFootprint(veganFootprint),
      vegetarian: FootprintHelper.getYearlyFootprint(vegetarianFootprint),
      whiteMeat: FootprintHelper.getYearlyFootprint(whiteMeatFootprint),
      redMeat: FootprintHelper.getYearlyFootprint(redMeatFootprint),
      whiteFish: FootprintHelper.getYearlyFootprint(whiteFishFootprint),
      fish: FootprintHelper.getYearlyFootprint(fishFootprint),
    });
  }
}
