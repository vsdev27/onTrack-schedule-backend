import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose from 'mongoose';

@Schema({ timestamps: true })
export class ExcelFileLink {
  
  @Prop()
  name: string;


  @Prop()
  link: string;

}

export type ExcelFileLinkDocument = ExcelFileLink & Document;
export const ExcelFileLinkSchema = SchemaFactory.createForClass(ExcelFileLink);

