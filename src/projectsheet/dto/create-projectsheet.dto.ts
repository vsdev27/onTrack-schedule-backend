import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateProjectsheetDto {
  @ApiProperty()
  fileName: string;

  @ApiProperty()
  isBaseFile: boolean;

  @ApiPropertyOptional()
  projectId: string;
}
