import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Schema as MongooseSchema } from 'mongoose';
import {
  AlimentationData,
  AlimentationDataFootprints,
  AlimentationDataMultipliers,
  AlimentationDataQuantities,
} from '../../domain/types/alimentation-types';

export type AlimentationDataDocument = HydratedDocument<AlimentationData>;

export const AlimentationModelName = 'alimentation';
export const AlimentationCollectionName = 'alimentations';

@Schema({ collection: AlimentationCollectionName })
export class MongoAlimentationData implements AlimentationData {
  @Prop({ required: true, type: MongooseSchema.Types.Mixed }) quantities: AlimentationDataQuantities;
  @Prop({ required: true, type: MongooseSchema.Types.Mixed }) footprints: AlimentationDataFootprints;
  @Prop({ required: true, type: MongooseSchema.Types.Mixed }) multipliers: AlimentationDataMultipliers;
}

export const AlimentationDataSchema = SchemaFactory.createForClass(MongoAlimentationData);
