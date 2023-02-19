import { ApiProperty } from '@nestjs/swagger';
import { AlimentationDto, BreakfastTypes, MilkTypes, SimulationDto, TransportDto } from 'carbon-cut-commons';
import { Type } from 'class-transformer';
import { IsEnum, IsNotEmpty, IsOptional, ValidateNested } from 'class-validator';
import { NestCarAnswer } from './nest-car-dto';
import { NestColdBeveragesAnswer } from './nest-cold-beverage-dto';
import { NestHotBeveragesAnswer } from './nest-hot-beverages-dto';
import { NestMealsAnswer } from './nest-meals-dto';

export class NestAlimentationDto implements AlimentationDto {
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

  @ApiProperty({ type: NestMealsAnswer })
  @IsNotEmpty()
  @ValidateNested()
  @Type(() => NestMealsAnswer)
  meals: NestMealsAnswer;
}

export class NestTransportDto implements TransportDto {
  @ApiProperty({ type: NestCarAnswer })
  @IsNotEmpty()
  @ValidateNested()
  @Type(() => NestCarAnswer)
  car: NestCarAnswer;
}

export class NestSimulationDto implements SimulationDto {
  @ApiProperty({ type: NestAlimentationDto })
  @IsNotEmpty()
  @ValidateNested()
  @Type(() => NestAlimentationDto)
  alimentation: NestAlimentationDto;

  @ApiProperty({ type: NestTransportDto })
  @IsNotEmpty()
  @ValidateNested()
  @Type(() => NestTransportDto)
  transport: NestTransportDto;
}
