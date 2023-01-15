import { ApiProperty } from '@nestjs/swagger';
import { BreakfastTypes, HotBeverages, SimulationDto } from 'carbon-cut-commons';

class NestHotBeverages implements HotBeverages {
  coffee: number;
  tea: number;
  hotChocolate: number;
}

export class NestSimulationDto implements SimulationDto {
  @ApiProperty({ enum: BreakfastTypes })
  breakfast: BreakfastTypes;

  @ApiProperty({ type: NestHotBeverages })
  hotBeverages: HotBeverages;
}
