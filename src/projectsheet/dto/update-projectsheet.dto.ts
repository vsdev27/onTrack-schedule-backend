import { PartialType } from '@nestjs/mapped-types';
import { CreateProjectsheetDto } from './create-projectsheet.dto';

export class UpdateProjectsheetDto extends PartialType(CreateProjectsheetDto) {}
