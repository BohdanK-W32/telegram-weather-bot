import { Schema, model, Document } from 'mongoose';

export interface ILoactionSchema extends Document {
  user_id: number;
  location: TLocation;
  created_at: Date;
}

export type TLocation = {
  lat: string;
  lng: string;
};

const LocationSchema: Schema = new Schema({
  user_id: { type: Number, required: true },
  location: {
    lat: { type: String, required: true },
    lng: { type: String, required: true }
  },
  created_at: { type: Date, default: Date.now }
});

module.exports = model<ILoactionSchema>('LocationSchema', LocationSchema, 'locationHistory');
