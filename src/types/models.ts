import { Document } from 'mongoose';
import { LocationType } from './';

export interface AdminSchemaInterface extends Document {
  user_id: number;
  is_owner: boolean;
  created_at: Date;
}

export interface LocationSchemaInterface extends Document {
  user_id: number;
  location: LocationType;
  created_at: Date;
}

export interface UserSchemaInterface extends Document {
  user_id: number;
  lang: string;
  created_at: Date;
}
