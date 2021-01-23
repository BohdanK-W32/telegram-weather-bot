import { Schema, model, Document } from 'mongoose';

export interface IUserSchema extends Document {
  user_id: number;
  lang: string;
  created_at: Date;
}

const UserSchema: Schema = new Schema({
  user_id: { type: Number, required: true },
  lang: { type: String, default: 'en' },
  created_at: { type: Date, default: Date.now }
});

module.exports = model<IUserSchema>('UserSchema', UserSchema, 'userData');
