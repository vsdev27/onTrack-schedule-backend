import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';

export class CreateUserDto {

  @IsNotEmpty()
  @ApiProperty()
  username: string;
  
  @IsNotEmpty()
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
