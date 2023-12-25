import { Controller, Get, Post, Body, Patch, Param, Delete, UseInterceptors, UploadedFile, Req, UseGuards, Query, Put } from '@nestjs/common';
import { AdminService } from './admin.service';
import { UpdateAdminDto } from './dto/update-admin.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { JwtAuthGuard } from 'src/auth/lib/jwt-auth.guard';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('Admin')
@Controller('admin')
export class AdminController {
  constructor(

    private readonly adminService: AdminService) { }

  @UseGuards(JwtAuthGuard)
  @Post('upload')
  @UseInterceptors(FileInterceptor('file'))
  async uploadExcel(
    @Req() req,
    @UploadedFile() file) {
    return await this.adminService.processExcelFile(req, file);
  }

  @UseGuards(JwtAuthGuard)
  @Get('allfile')
  async getAllfiles(
    @Query('page') page: number = 1,
    @Query('limit') limit: number = 10,
    @Query('search') search: string = '',
  ) {
    return await this.adminService.getAllfiles(page, limit, search);
  }


  @UseGuards(JwtAuthGuard)
  @Post('project/create')
  @UseInterceptors(FileInterceptor('file'))
  async createProject(
    @Req() request,
    @UploadedFile() file,
    @Body('data') projectdata: string,

  ) {

    return await this.adminService.createProject(request, file, projectdata);
  }

  @UseGuards(JwtAuthGuard)
  @Get('project/file-data/:project_id')
  async getdataMap(
    @Param('project_id') project_id: string
  ) {
    return await this.adminService.getdataMap(project_id);
  }

  @UseGuards(JwtAuthGuard)
  @Get('project/all')
  async getAllProject(
    @Query('page') page: number = 1,
    @Query('limit') limit: number = 10,
    @Query('search') search: string = ''

  ) {
    return await this.adminService.getAllProject(page, limit, search);
  }


  @UseGuards(JwtAuthGuard)
  @Get('project/:project_id')
  async getProject(
    @Param('project_id') project_id: string

  ) {
    return await this.adminService.getProject(project_id);
  }


  @UseGuards(JwtAuthGuard)
  @Put('project/edit/:project_id')
  @UseInterceptors(FileInterceptor('file'))
  async editProject(
    @Req() request,
    @Param('project_id') project_id,
    @UploadedFile() file,
    @Body('data') projectdata: string,

  ) {
      console.log(projectdata)
    return await this.adminService.editProject(request, project_id, file, projectdata);
  }

  @UseGuards(JwtAuthGuard)
  @Delete('project/:project_id')
  async deleteProject(
    @Param('project_id') project_id: string

  ) {
    return await this.adminService.deleteProject(project_id);
  }







}
