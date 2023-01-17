import { HotBeveragesDto } from './beverages-dto';

export interface CarbonFootprintDto {
  breakfast?: number;
  hotBeverages?: HotBeveragesDto;
  total: number;
}
