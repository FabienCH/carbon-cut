import { ApiProperty } from '@nestjs/swagger';
import { BreakfastTypes, SimulationDto } from 'carbon-cut-commons';
import { Beverages } from 'carbon-cut-commons/dist/types/beverages';

class NestBeverages implements Beverages {
  coffee: number;
  tea: number;
  hotChocolate: number;
}

export class NestSimulationDto implements SimulationDto {
  @ApiProperty({ enum: BreakfastTypes })
  breakfast: BreakfastTypes;

  @ApiProperty({ type: NestBeverages })
  beverages: Beverages;
}
