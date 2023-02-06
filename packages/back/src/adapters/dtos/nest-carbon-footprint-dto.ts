import { ApiProperty } from '@nestjs/swagger';
import { CarbonFootprintDto, ColdBeveragesFootprints, HotBeveragesFootprints, MealsFootprints } from 'carbon-cut-commons';

class NestHotBeveragesFootprintsDto implements HotBeveragesFootprints {
  @ApiProperty({ required: false })
  coffee?: number;
  @ApiProperty({ required: false })
  tea?: number;
  @ApiProperty({ required: false })
  hotChocolate?: number;
  @ApiProperty({ required: false })
  total?: number;
}

class NestColdBeveragesFootprintsDto implements ColdBeveragesFootprints {
  @ApiProperty({ required: false })
  sweet?: number;
  @ApiProperty({ required: false })
  alcohol?: number;
  @ApiProperty({ required: false })
  total?: number;
}

class NestMealsFootprintsDto implements MealsFootprints {
  @ApiProperty({ required: false })
  vegan?: number;
  @ApiProperty({ required: false })
  vegetarian?: number;
  @ApiProperty({ required: false })
  whiteMeat?: number;
  @ApiProperty({ required: false })
  redMeat?: number;
  @ApiProperty({ required: false })
  whiteFish?: number;
  @ApiProperty({ required: false })
  fish?: number;
  @ApiProperty()
  total: number;
}

export class NestCarbonFootprintDto implements CarbonFootprintDto {
  @ApiProperty({ required: false })
  breakfast?: number;
  @ApiProperty({ required: false, type: NestHotBeveragesFootprintsDto })
  hotBeverages?: HotBeveragesFootprints;
  @ApiProperty({ required: false, type: NestColdBeveragesFootprintsDto })
  coldBeverages?: ColdBeveragesFootprints;
  @ApiProperty({ type: NestMealsFootprintsDto })
  meals: MealsFootprints;
  @ApiProperty()
  total: number;
}
