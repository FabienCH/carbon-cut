import { ApiProperty } from '@nestjs/swagger';
import { MealsFootprints } from 'carbon-cut-commons';

export class NestMealsFootprintsDto implements MealsFootprints {
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
