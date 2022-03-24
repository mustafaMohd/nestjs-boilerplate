import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import * as mongoose from 'mongoose';
import { User } from '../user/user.model';

@Schema({
  timestamps: true,
})
export class Token extends Document {
  @Prop({ required: true })
  token: string;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: User.name })
  user: User;

  @Prop({ required: true, enum: ['access', 'refresh'] })
  type: string;

  @Prop({ required: true })
  expiresIn: Date;

  @Prop({ required: true, default: false })
  blacklisted: boolean;
}

export const TokenSchema = SchemaFactory.createForClass(Token);
