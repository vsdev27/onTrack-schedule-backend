import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseInterceptors,
  UploadedFile,
} from '@nestjs/common';
import { ProjectsheetService } from './projectsheet.service';
import { CreateProjectsheetDto } from './dto/create-projectsheet.dto';
import { ApiBody, ApiConsumes } from '@nestjs/swagger';
import { FileInterceptor } from '@nestjs/platform-express';

@Controller('projectsheet')
export class ProjectsheetController {
  constructor(private readonly projectsheetService: ProjectsheetService) {}

  // @Post('import')
  // @ApiConsumes('multipart/form-data')
  // @ApiBody({
  //   schema: {
  //     type: 'object',
  //     properties: {
  //       fileName: { type: 'string' },
  //       projectId: { type: 'string' },
  //       isBaseFile: { type: 'boolean' },
  //       file: { type: 'string', format: 'binary' },
  //     },
  //   },
  // })
  // @UseInterceptors(FileInterceptor('file'))
  // create(
  //   @UploadedFile() file,
  //   @Body() createProjectsheetDto: CreateProjectsheetDto,
  // ) {
  //   return this.projectsheetService.create(createProjectsheetDto);
  // }
}
