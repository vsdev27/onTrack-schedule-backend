import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

@Schema({ timestamps: true })
export class Projectsheet {
  @Prop()
  fileName: string;

  @Prop({ default: false })
  isBaseFile: boolean;

  @Prop()
  projectId: string;
}

export type ProjectsheetDocument = Projectsheet & Document;
export const ProjectsheetSchema = SchemaFactory.createForClass(Projectsheet);
