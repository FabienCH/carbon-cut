import { ApiProperty } from '@nestjs/swagger';
import {
  AlimentationFootprintDto,
  CarbonFootprintDto,
  ColdBeveragesFootprints,
  HotBeveragesFootprints,
  MealsFootprints,
} from 'carbon-cut-commons';
import { Type } from 'class-transformer';
import { IsNotEmpty, ValidateNested } from 'class-validator';
import { NestColdBeveragesFootprintsDto } from './nest-cold-beverages-footprint-dto';
import { NestHotBeveragesFootprintsDto } from './nest-hot-beverages-footprint-dto';
import { NestMealsFootprintsDto } from './nest-meals-footprint-dto';

export class NestAlimentationFootprintDto implements AlimentationFootprintDto {
  @ApiProperty({ required: false })
  breakfast?: number;
  @ApiProperty({ required: false, type: NestHotBeveragesFootprintsDto })
  hotBeverages?: HotBeveragesFootprints;
  @ApiProperty({ required: false, type: NestColdBeveragesFootprintsDto })
  coldBeverages?: ColdBeveragesFootprints;
  @ApiProperty({ type: NestMealsFootprintsDto })
  meals: MealsFootprints;
  @ApiProperty()
  total: number;
}

export class NestCarbonFootprintDto implements CarbonFootprintDto {
  @ApiProperty({ type: NestAlimentationFootprintDto })
  @IsNotEmpty()
  @ValidateNested()
  @Type(() => NestAlimentationFootprintDto)
  alimentation: NestAlimentationFootprintDto;
}
