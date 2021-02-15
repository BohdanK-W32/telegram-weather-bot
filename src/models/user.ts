import { Schema, model } from 'mongoose';
import { UserSchemaInterface } from 'types/models';

const UserSchema: Schema = new Schema({
  user_id: { type: Number, required: true },
  lang: { type: String, default: 'en' },
  created_at: { type: Date, default: Date.now }
});

export default model<UserSchemaInterface>('UserSchema', UserSchema, 'userData');
