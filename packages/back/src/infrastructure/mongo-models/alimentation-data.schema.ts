import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Schema as MongooseSchema } from 'mongoose';
import {
  AlimentationData,
  AlimentationFootprints,
  AlimentationMultipliers,
  AlimentationQuantities,
} from '../../domain/entities/simulation-data';

export type AlimentationDataDocument = HydratedDocument<AlimentationData>;

export const AlimentationModelName = 'alimentation';
export const AlimentationCollectionName = 'alimentations';

@Schema({ collection: AlimentationCollectionName })
export class MongoAlimentationData implements AlimentationData {
  @Prop({ required: true, type: MongooseSchema.Types.Mixed }) quantities: AlimentationQuantities;
  @Prop({ required: true, type: MongooseSchema.Types.Mixed }) footprints: AlimentationFootprints;
  @Prop({ required: true, type: MongooseSchema.Types.Mixed }) multipliers: AlimentationMultipliers;
}

export const AlimentationDataSchema = SchemaFactory.createForClass(MongoAlimentationData);
