import { ColdBeveragesAnswer, HotBeveragesAnswer } from '../beverages';

export type HotBeveragesFootprints = Partial<HotBeveragesAnswer> & { total?: number };
export type ColdBeveragesFootprints = Partial<ColdBeveragesAnswer> & { total?: number };
