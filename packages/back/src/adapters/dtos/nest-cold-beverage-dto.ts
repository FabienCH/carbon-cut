import { ApiProperty } from '@nestjs/swagger';
import { ColdBeveragesAnswer } from 'carbon-cut-commons';
import { IsNotEmpty, IsNumber } from 'class-validator';

export class NestColdBeveragesAnswer implements ColdBeveragesAnswer {
  @ApiProperty()
  @IsNotEmpty()
  @IsNumber()
  sweet: number;

  @ApiProperty()
  @IsNotEmpty()
  @IsNumber()
  alcohol: number;
}
