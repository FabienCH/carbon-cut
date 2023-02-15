import { ApiProperty } from '@nestjs/swagger';
import { CarAnswer, CarSize, EngineType, FuelType } from 'carbon-cut-commons';
import { IsEnum, IsNotEmpty, IsNumber, IsOptional } from 'class-validator';

export class NestCarAnswer implements CarAnswer {
  @ApiProperty()
  @IsNotEmpty()
  @IsNumber()
  km: number;

  @ApiProperty({ enum: EngineType })
  @IsNotEmpty()
  @IsEnum(EngineType)
  engineType: EngineType;

  @ApiProperty({ enum: FuelType })
  @IsOptional()
  @IsEnum(FuelType)
  fuelType?: FuelType;

  @ApiProperty()
  @IsOptional()
  @IsNumber()
  fuelConsumption?: number;

  @ApiProperty({ enum: CarSize })
  @IsOptional()
  @IsEnum(CarSize)
  carSize?: CarSize;
}
