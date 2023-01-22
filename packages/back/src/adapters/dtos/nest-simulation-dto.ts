import { ApiProperty } from '@nestjs/swagger';
import { BreakfastTypes, ColdBeveragesAnswer, HotBeveragesAnswer, MilkTypes, SimulationDto } from 'carbon-cut-commons';

class NestHotBeveragesAnswer implements HotBeveragesAnswer {
  @ApiProperty()
  coffee: number;
  @ApiProperty()
  tea: number;
  @ApiProperty()
  hotChocolate: number;
}

class NestColdBeveragesAnswer implements ColdBeveragesAnswer {
  @ApiProperty()
  sweet: number;
}

export class NestSimulationDto implements SimulationDto {
  @ApiProperty({ enum: BreakfastTypes })
  breakfast: BreakfastTypes;

  @ApiProperty({ enum: MilkTypes })
  milkType: MilkTypes;

  @ApiProperty({ type: NestHotBeveragesAnswer })
  hotBeverages: NestHotBeveragesAnswer;

  @ApiProperty({ type: NestColdBeveragesAnswer })
  coldBeverages: NestColdBeveragesAnswer;
}
