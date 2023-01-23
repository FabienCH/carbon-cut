import { ApiProperty } from '@nestjs/swagger';
import { CarbonFootprintDto, ColdBeveragesFootprints, HotBeveragesFootprints } from 'carbon-cut-commons';

class NestHotBeveragesDto implements HotBeveragesFootprints {
  @ApiProperty({ required: false })
  coffee?: number;
  @ApiProperty({ required: false })
  tea?: number;
  @ApiProperty({ required: false })
  hotChocolate?: number;
  @ApiProperty({ required: false })
  total?: number;
}

class NestColdBeveragesDto implements ColdBeveragesFootprints {
  @ApiProperty({ required: false })
  sweet?: number;
  @ApiProperty({ required: false })
  total?: number;
}

export class NestCarbonFootprintDto implements CarbonFootprintDto {
  @ApiProperty({ required: false })
  breakfast?: number;
  @ApiProperty({ required: false, type: NestHotBeveragesDto })
  hotBeverages?: HotBeveragesFootprints;
  @ApiProperty({ required: false, type: NestColdBeveragesDto })
  coldBeverages?: ColdBeveragesFootprints;
  @ApiProperty()
  total: number;
}
