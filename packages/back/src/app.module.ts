import { Module } from '@nestjs/common';
import { FileSimulationDataRepository, SimulationDataRepositoryToken } from './adapters/repositories/file-simulation-data.repository';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { SimulationDataMapper } from './domain/entities/simulation-data-mapper';
import { SimulationDataImportUseCase } from './domain/usecases/simulation-data-import.usecase';

@Module({
  imports: [],
  controllers: [AppController],
  providers: [
    AppService,
    SimulationDataImportUseCase,
    SimulationDataMapper,
    { provide: SimulationDataRepositoryToken, useClass: FileSimulationDataRepository },
  ],
})
export class AppModule {}
