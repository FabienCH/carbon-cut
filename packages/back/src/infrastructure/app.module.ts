import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { NestCarbonFootprintController } from '../adapters/controllers/nest-carbon-footprint.controller';
import { FileSimulationDataSourceRepository } from '../adapters/repositories/file-simulation-datasource.repository';
import { MongoSimulationDataRepository } from '../adapters/repositories/mongo-simulation-data.repository';
import { SimulationDataSourceMapper } from '../domain/entities/simulation-datasource-mapper';
import { SimulationDataRepositoryToken } from '../domain/ports/repositories/simulation-data.repository';
import { SimulationDataSourceRepositoryToken } from '../domain/ports/repositories/simulation-datasource.repository';
import { CalculateCarbonFootprintUseCase } from '../domain/usecases/calculate-carbon-footprint.usecase';
import { SimulationDataImportUseCase } from '../domain/usecases/simulation-data-import.usecase';
import { AlimentationDataSchema, AlimentationModelName } from './mongo-models/alimentation-data.schema';

@Module({
  imports: [
    MongooseModule.forRoot('mongodb://127.0.0.1:27017/carbon_cut'),
    MongooseModule.forFeature([{ name: AlimentationModelName, schema: AlimentationDataSchema }]),
  ],
  controllers: [NestCarbonFootprintController],
  providers: [
    SimulationDataImportUseCase,
    SimulationDataSourceMapper,
    CalculateCarbonFootprintUseCase,
    { provide: SimulationDataSourceRepositoryToken, useClass: FileSimulationDataSourceRepository },
    { provide: SimulationDataRepositoryToken, useClass: MongoSimulationDataRepository },
  ],
})
export class AppModule {
  constructor(private readonly simulationDataImportUseCase: SimulationDataImportUseCase) {
    this.simulationDataImportUseCase.execute();
  }
}
