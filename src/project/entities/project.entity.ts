import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose from 'mongoose';

@Schema({ timestamps: true })
export class Project {
  @Prop()
  name: string;

  @Prop()
  projectfile_name: string;

  @Prop()
  projectfile_link: string;
  
  @Prop()
  baseFile_link: string;

  @Prop()
  baseFileName: string;

  @Prop({ default: false })
  completedTasks: boolean;

  @Prop({ default: false })
  supervisorSearch: boolean;

  @Prop({ default: false })
  workOrderSearch: boolean;

  @Prop({ default: false })
  criticalIndicator: boolean;

  @Prop({ type: mongoose.Schema.Types.Mixed, default: [] })
  indicators: [
    {
      tolerance: string;
      minValue: number;
      maxValue: number;
    },
  ];
}

export type ProjectDocument = Project & Document;
export const ProjectSchema = SchemaFactory.createForClass(Project);
