import { ValidationError } from '@domain/entities/validation-error';
import { CarbonFootprintController } from '@domain/ports/controllers/carbon-footprint.controller';
import { CalculateCarbonFootprintUseCase } from '@domain/usecases/calculate-carbon-footprint.usecase';
import { Body, Controller, HttpException, HttpStatus, Post } from '@nestjs/common';
import { ApiResponse, ApiTags } from '@nestjs/swagger';
import { NestCarbonFootprintDto } from '../dtos/nest-carbon-footprint-dto';
import { NestSimulationDto } from '../dtos/nest-simulation-dto';

@ApiTags('Carbon Footprint')
@Controller('carbon-footprint')
export class NestCarbonFootprintController implements CarbonFootprintController {
  constructor(private readonly calculateCarbonFootprintUseCase: CalculateCarbonFootprintUseCase) {}

  @Post('calculate')
  @ApiResponse({ status: 201, type: NestCarbonFootprintDto })
  async calculate(@Body() simulationAnswers: NestSimulationDto): Promise<NestCarbonFootprintDto> {
    try {
      return await this.calculateCarbonFootprintUseCase.execute(simulationAnswers);
    } catch (error) {
      const errorMessage = this.#getErrorMessage(error);

      throw new HttpException(errorMessage, HttpStatus.BAD_REQUEST);
    }
  }

  #getErrorMessage(error: unknown): string | Record<string, unknown> {
    if (typeof error === 'object') {
      if (error instanceof ValidationError) {
        return {
          statusCode: HttpStatus.BAD_REQUEST,
          message: error.errors,
          error: 'Bad Request',
        };
      }
      if ('message' in error) {
        return error.message as string;
      }
    }

    return JSON.stringify(error);
  }
}
