import { ApiProperty } from '@nestjs/swagger';
import { HotBeveragesFootprints } from 'carbon-cut-commons';

export class NestHotBeveragesFootprintsDto implements HotBeveragesFootprints {
  @ApiProperty({ required: false })
  coffee?: number;
  @ApiProperty({ required: false })
  tea?: number;
  @ApiProperty({ required: false })
  hotChocolate?: number;
  @ApiProperty({ required: false })
  total?: number;
}
