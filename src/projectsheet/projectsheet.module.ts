import { Module } from '@nestjs/common';
import { ProjectsheetService } from './projectsheet.service';
import { ProjectsheetController } from './projectsheet.controller';

@Module({
  controllers: [ProjectsheetController],
  providers: [ProjectsheetService],
})
export class ProjectsheetModule {}
