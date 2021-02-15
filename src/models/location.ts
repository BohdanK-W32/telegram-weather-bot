import { Schema, model } from 'mongoose';
import { LocationSchemaInterface } from 'types/models';

const LocationSchema: Schema = new Schema({
  user_id: { type: Number, required: true },
  location: {
    lat: { type: String, required: true },
    lng: { type: String, required: true }
  },
  created_at: { type: Date, default: Date.now }
});

export default model<LocationSchemaInterface>('LocationSchema', LocationSchema, 'locationHistory');
