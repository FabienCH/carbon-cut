import { HotBeverages } from '../beverages';

export type HotBeveragesDto = Partial<HotBeverages> & { total?: number };
