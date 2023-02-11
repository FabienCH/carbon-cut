import { InjectConnection, InjectModel } from '@nestjs/mongoose';
import { Connection, Model } from 'mongoose';
import { SimulationDataRepository } from '../../domain/ports/repositories/simulation-data.repository';
import { SimulationData } from '../../domain/types/simulation-data';
import {
  SimulationCollectionName,
  SimulationDataDocument,
  SimulationModelName,
} from '../../infrastructure/mongo-models/simulation-data.schema';

export class MongoSimulationDataRepository implements SimulationDataRepository {
  constructor(
    @InjectConnection() private connection: Connection,
    @InjectModel(SimulationModelName) private alimentationDataModel: Model<SimulationDataDocument>,
  ) {}

  async insert(simulationData: SimulationData): Promise<void> {
    await this.connection.collection(SimulationCollectionName).deleteMany({});
    const createdAlimentationData = new this.alimentationDataModel(simulationData);
    await createdAlimentationData.save();
  }

  async get(): Promise<SimulationData> {
    return this.alimentationDataModel.findOne();
  }
}
