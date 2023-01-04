import { ApiProperty } from '@nestjs/swagger';
import { BreakfastTypes, SimulationDto } from 'carbon-cut-types';

export class NestSimulationDto implements SimulationDto {
  @ApiProperty({ enum: BreakfastTypes })
  breakfast: BreakfastTypes;
}
