import { ApiProperty } from '@nestjs/swagger';
import { BreakfastTypes, ColdBeverages, HotBeverages, MilkTypes, SimulationDto } from 'carbon-cut-commons';

class NestHotBeverages implements HotBeverages {
  @ApiProperty()
  coffee: number;
  @ApiProperty()
  tea: number;
  @ApiProperty()
  hotChocolate: number;
}

class NestColdBeverages implements ColdBeverages {
  @ApiProperty()
  sweet: number;
}

export class NestSimulationDto implements SimulationDto {
  @ApiProperty({ enum: BreakfastTypes })
  breakfast: BreakfastTypes;

  @ApiProperty({ enum: MilkTypes })
  milkType: MilkTypes;

  @ApiProperty({ type: NestHotBeverages })
  hotBeverages: NestHotBeverages;

  @ApiProperty({ type: NestColdBeverages })
  coldBeverages: NestColdBeverages;
}
