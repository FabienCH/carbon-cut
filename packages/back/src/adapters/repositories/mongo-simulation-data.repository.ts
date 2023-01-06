import { InjectConnection, InjectModel } from '@nestjs/mongoose';
import { Connection, Model } from 'mongoose';
import { AlimentationData } from '../../domain/entities/simulation-data';
import { SimulationDataRepository } from '../../domain/ports/repositories/simulation-data.repository';
import {
  AlimentationCollectionName,
  AlimentationDataDocument,
  AlimentationModelName,
} from '../../infrastructure/mongo-models/alimentation-data.schema';

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

  async get(): Promise<AlimentationData> {
    return this.alimentationDataModel.findOne();
  }
}
