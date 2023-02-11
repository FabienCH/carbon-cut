import { ApiProperty } from '@nestjs/swagger';
import { ColdBeveragesFootprints } from 'carbon-cut-commons';

export class NestColdBeveragesFootprintsDto implements ColdBeveragesFootprints {
  @ApiProperty({ required: false })
  sweet?: number;
  @ApiProperty({ required: false })
  alcohol?: number;
  @ApiProperty({ required: false })
  total?: number;
}
