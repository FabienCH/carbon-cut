import { Body, Controller, Post } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { CarbonFootprintController } from '../../domain/ports/controllers/carbon-footprint.controller';
import { CalculateCarbonFootprintUseCase } from '../../domain/usecases/calculate-carbon-footprint.usecase';
import { NestSimulationDto } from '../dtos/nest-simulation-dto';

@ApiTags('Carbon Footprint')
@Controller('carbon-footprint')
export class NestCarbonFootprintController implements CarbonFootprintController {
  constructor(private readonly calculateCarbonFootprintUseCase: CalculateCarbonFootprintUseCase) {}

  @Post('calculate')
  calculate(@Body() simulationAnswers: NestSimulationDto): Promise<number> {
    return this.calculateCarbonFootprintUseCase.execute({ breakfast: simulationAnswers.breakfast });
  }
}
