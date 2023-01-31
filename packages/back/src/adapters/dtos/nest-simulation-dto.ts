import { ApiProperty } from '@nestjs/swagger';
import { BreakfastTypes, ColdBeveragesAnswer, HotBeveragesAnswer, MilkTypes, SimulationDto } from 'carbon-cut-commons';
import { Type } from 'class-transformer';
import { IsEnum, IsNotEmpty, IsNumber, IsOptional, ValidateNested } from 'class-validator';

class NestHotBeveragesAnswer implements HotBeveragesAnswer {
  @ApiProperty()
  @IsNotEmpty()
  @IsNumber()
  coffee: number;

  @ApiProperty()
  @IsNotEmpty()
  @IsNumber()
  tea: number;

  @ApiProperty()
  @IsNotEmpty()
  @IsNumber()
  hotChocolate: number;
}

class NestColdBeveragesAnswer implements ColdBeveragesAnswer {
  @ApiProperty()
  @IsNotEmpty()
  @IsNumber()
  sweet: number;

  @ApiProperty()
  @IsNotEmpty()
  @IsNumber()
  alcohol: number;
}

export class NestSimulationDto implements SimulationDto {
  @ApiProperty({ enum: BreakfastTypes })
  @IsNotEmpty()
  @IsEnum(BreakfastTypes)
  breakfast: BreakfastTypes;

  @ApiProperty({ enum: MilkTypes })
  @IsEnum(MilkTypes)
  @IsOptional()
  milkType?: MilkTypes;

  @ApiProperty({ type: NestHotBeveragesAnswer })
  @IsNotEmpty()
  @ValidateNested()
  @Type(() => NestHotBeveragesAnswer)
  hotBeverages: NestHotBeveragesAnswer;

  @ApiProperty({ type: NestColdBeveragesAnswer })
  @IsNotEmpty()
  @ValidateNested()
  @Type(() => NestColdBeveragesAnswer)
  coldBeverages: NestColdBeveragesAnswer;
}
