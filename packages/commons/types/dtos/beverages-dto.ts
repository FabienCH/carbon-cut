import { ColdBeverages, HotBeverages } from '../beverages';

export type HotBeveragesFootprints = Partial<HotBeverages> & { total?: number };
export type ColdBeveragesFootprints = Partial<ColdBeverages> & { total?: number };
