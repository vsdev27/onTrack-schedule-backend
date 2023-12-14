import { ApiProperty } from '@nestjs/swagger';

export class CreateProjectDto {
  @ApiProperty()
  name: string;

  @ApiProperty()
  fileReferenceId: string;

  @ApiProperty({ default: false })
  completedTasks: boolean;

  @ApiProperty({ default: false })
  supervisorSearch: boolean;

  @ApiProperty({ default: false })
  workOrderSearch: boolean;

  @ApiProperty({ default: false })
  criticalIndicator: boolean;

  @ApiProperty({ default: [] })
  indicators: [
    {
      tolerance: string;
      minValue: number;
      maxValue: number;
    },
  ];
}
