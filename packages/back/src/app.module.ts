import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import {
  FileSimulationDataSourceRepository,
  SimulationDataSourceRepositoryToken,
} from './adapters/repositories/file-simulation-datasource.repository';
import { MongoSimulationDataRepository, SimulationDataRepositoryToken } from './adapters/repositories/mongo-simulation-data.repository';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { SimulationDataSourceMapper } from './domain/entities/simulation-datasource-mapper';
import { SimulationDataImportUseCase } from './domain/usecases/simulation-data-import.usecase';
import { AlimentationDataSchema, AlimentationModelName } from './infrastructure/mongo-models/alimentation-data.schema';

@Module({
  imports: [
    MongooseModule.forRoot('mongodb://127.0.0.1:27017/carbon_cut'),
    MongooseModule.forFeature([{ name: AlimentationModelName, schema: AlimentationDataSchema }]),
  ],
  controllers: [AppController],
  providers: [
    AppService,
    SimulationDataImportUseCase,
    SimulationDataSourceMapper,
    { provide: SimulationDataSourceRepositoryToken, useClass: FileSimulationDataSourceRepository },
    { provide: SimulationDataRepositoryToken, useClass: MongoSimulationDataRepository },
  ],
})
export class AppModule {
  constructor(private readonly simulationDataImportUseCase: SimulationDataImportUseCase) {
    this.simulationDataImportUseCase.execute();
  }
}
