import { Schema, model } from 'mongoose';
import { AdminSchemaInterface } from 'types/models';

const AdminSchema: Schema = new Schema({
  user_id: { type: Number, required: true },
  is_owner: { type: Boolean, default: false },
  created_at: { type: Date, default: Date.now }
});

export default model<AdminSchemaInterface>('Admin', AdminSchema, 'admin');
