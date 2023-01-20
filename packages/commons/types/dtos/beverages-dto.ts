import { ColdBeverages, HotBeverages } from '../beverages';

export type HotBeveragesDto = Partial<HotBeverages> & { total?: number };
export type ColdBeveragesDto = Partial<ColdBeverages> & { total?: number };
