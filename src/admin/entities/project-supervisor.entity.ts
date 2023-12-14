import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose from 'mongoose';

@Schema({ timestamps: true })
export class ProjectSupervisor {
  
  @Prop()
  name: string;

}

export type ProjectSupervisorDocument = ProjectSupervisor & Document;
export const ProjectSupervisorSchema = SchemaFactory.createForClass(ProjectSupervisor);

