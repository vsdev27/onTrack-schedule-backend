import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateUserDto {
  @ApiProperty()
  username: string;

  @ApiProperty()
  password?: string;

  @ApiProperty()
  projectTrackingAccess?: boolean;

  // @ApiProperty()
  // viewActivityAccess?: boolean;

  @ApiProperty()
  activityWriteAccess?: string;

  @ApiProperty()
  projects?: Array<string>;

  @ApiProperty()
  writeAccessSupervisors?: Array<string>;
}
