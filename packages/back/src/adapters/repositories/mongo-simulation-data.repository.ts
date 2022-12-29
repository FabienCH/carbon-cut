import { InjectionToken } from '@nestjs/common';
import { InjectConnection, InjectModel } from '@nestjs/mongoose';
import { Connection, Model } from 'mongoose';
import { AlimentationData } from '../../domain/entities/simulation-data';
import { SimulationDataRepository } from '../../domain/repositories/simulation-data.repository';
import {
  AlimentationCollectionName,
  AlimentationDataDocument,
  AlimentationModelName,
} from '../../infrastructure/mongo-models/alimentation-data.schema';

export const SimulationDataRepositoryToken: InjectionToken = 'SimulationDataRepository';

export class MongoSimulationDataRepository implements SimulationDataRepository {
  constructor(
    @InjectConnection() private connection: Connection,
    @InjectModel(AlimentationModelName) private alimentationDataModel: Model<AlimentationDataDocument>,
  ) {}

  async insert(simulationData: AlimentationData): Promise<void> {
    await this.connection.collection(AlimentationCollectionName).deleteMany({});
    const createdAlimentationData = new this.alimentationDataModel(simulationData);
    await createdAlimentationData.save();
  }
}
