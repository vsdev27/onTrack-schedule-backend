import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

@Schema({ timestamps: true })
export class User {
  @Prop({ required: true })
  username: string;

  @Prop({ required: true })
  password: string;

  @Prop()
  roles: string;

  @Prop({ default: false })
 update_received: boolean;

  @Prop({ default: false })
  projectTrackingAccess: boolean;

  // @Prop({ default: false })
  // activityViewAccess: boolean;

  @Prop({ default: false })
  activityWriteAccess: boolean;

  @Prop({ default: [] })
  writeAccessSupervisors: Array<string>;

  @Prop({ default: [] })
  projects: Array<string>;
}

export type UserDocument = User & Document;
export const UserSchema = SchemaFactory.createForClass(User);
