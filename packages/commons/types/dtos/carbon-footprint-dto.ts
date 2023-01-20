import { ColdBeveragesDto, HotBeveragesDto } from './beverages-dto';

export interface CarbonFootprintDto {
  breakfast?: number;
  hotBeverages?: HotBeveragesDto;
  coldBeverages?: ColdBeveragesDto;
  total: number;
}
