import { Schema, model, Document } from 'mongoose';

export interface IAdminSchema extends Document {
  user_id: number;
  is_owner: boolean;
  created_at: Date;
}

const AdminSchema: Schema = new Schema({
  user_id: { type: Number, required: true },
  is_owner: { type: Boolean, default: false },
  created_at: { type: Date, default: Date.now }
});

export default model<IAdminSchema>('Admin', AdminSchema, 'admin');
