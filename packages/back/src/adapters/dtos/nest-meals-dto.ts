import { ApiProperty } from '@nestjs/swagger';
import { MealsAnswer } from 'carbon-cut-commons';
import { IsNotEmpty, IsNumber } from 'class-validator';

export class NestMealsAnswer implements MealsAnswer {
  @ApiProperty()
  @IsNotEmpty()
  @IsNumber()
  vegan: number;

  @ApiProperty()
  @IsNotEmpty()
  @IsNumber()
  vegetarian: number;

  @ApiProperty()
  @IsNotEmpty()
  @IsNumber()
  whiteMeat: number;

  @ApiProperty()
  @IsNotEmpty()
  @IsNumber()
  redMeat: number;

  @ApiProperty()
  @IsNotEmpty()
  @IsNumber()
  whiteFish: number;

  @ApiProperty()
  @IsNotEmpty()
  @IsNumber()
  fish: number;
}
