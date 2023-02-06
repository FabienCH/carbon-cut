import { MealsAnswer } from '../meals';

export type MealsFootprints = Partial<MealsAnswer> & { total: number };
