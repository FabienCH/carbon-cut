import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Schema as MongooseSchema } from 'mongoose';
import { AlimentationData } from '../../domain/types/alimentation-types';
import { SimulationData } from '../../domain/types/simulation-data';
import { TransportData } from '../../domain/types/transport-types';

export type SimulationDataDocument = HydratedDocument<SimulationData>;

export const SimulationModelName = 'simulation';
export const SimulationCollectionName = 'simulation';

@Schema({ collection: SimulationCollectionName })
export class MongoSimulationData implements SimulationData {
  @Prop({ required: true, type: MongooseSchema.Types.Mixed }) alimentationData: AlimentationData;
  @Prop({ required: true, type: MongooseSchema.Types.Mixed }) transportData: TransportData;
}

export const SimulationDataSchema = SchemaFactory.createForClass(MongoSimulationData);
