import { ApiProperty } from '@nestjs/swagger';
import { HotBeveragesAnswer } from 'carbon-cut-commons';
import { IsNotEmpty, IsNumber } from 'class-validator';

export class NestHotBeveragesAnswer implements HotBeveragesAnswer {
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
