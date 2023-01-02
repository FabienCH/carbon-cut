import { Body, Controller, Post } from '@nestjs/common';
import { BreakfastTypes } from '../../domain/entities/simulation-data';
import { CarbonFootprintController } from '../../domain/ports/controllers/carbon-footprint.controller';
import { CalculateCarbonFootprintUseCase } from '../../domain/usecases/calculate-carbon-footprint.usecase';

@Controller('carbon-footprint')
export class NestCarbonFootprintController implements CarbonFootprintController {
  constructor(private readonly calculateCarbonFootprintUseCase: CalculateCarbonFootprintUseCase) {}

  @Post('calculate')
  calculate(@Body() breakfast: BreakfastTypes): Promise<number> {
    return this.calculateCarbonFootprintUseCase.execute({ breakfast });
  }
}
