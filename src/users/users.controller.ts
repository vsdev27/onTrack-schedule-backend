import {
  Controller,
  Post,
  UseGuards,
  Req,
  Query,
  Body,
  Get,
  Param,
  Put,
  Patch,
  Delete,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/auth/lib/jwt-auth.guard';
import { CreateUserDto } from './dto/create-user.dto';

@ApiTags('User')
@Controller('user')
export class UsersController {
  constructor(
    private readonly userService: UsersService
  ) { }


  @UseGuards(JwtAuthGuard)
  @Post('admin/create')
  async createUser(
    @Body() userdata:CreateUserDto,
  ) {
   // console.log("sad",userdata)
    return await this.userService.create(userdata);
  }

  @UseGuards(JwtAuthGuard)
  @Get('admin/all')
  async allUser(
    @Query('page') page: number = 1,
    @Query('limit') limit: number = 10,
    @Query('search') search: string = ''
  ) {
    return await this.userService.getAlluser(page,limit,search);
  }


  @UseGuards(JwtAuthGuard)
  @Get('admin/:user_id')
  async getUser(
    @Param('user_id') user_id,

  ) {
    return await this.userService.getUser(user_id);
  }

  @UseGuards(JwtAuthGuard)
  @Put('admin/:user_id')
  async updateUser(
    @Param('user_id') user_id,
    @Body() data:any,


  ) {
   // console.log("is",data)
    return await this.userService.updateUser(user_id,data);
  }
  

  @UseGuards(JwtAuthGuard)
  @Delete('admin/:user_id')
  async deleteUser(
    @Param('user_id') user_id,

  ) {
    return await this.userService.deleteUser(user_id);
  }


  //find-by-project//
  @UseGuards(JwtAuthGuard)
  @Get('admin/find-by-project/:project_id')
  async findbyProject(
    @Param('project_id') project_id,
    @Query('page') page: number = 1,
    @Query('limit') limit: number = 10,

  ) {
    return await this.userService.findbyProject(page,limit,project_id);
  }


  @UseGuards(JwtAuthGuard)
  @Get('supervisors')
  async getallSupervisors (

  ) {
    return await this.userService.getallSupervisors();
  }


  
  @UseGuards(JwtAuthGuard)
  @Get('projects')
  async getuserProject(
    @Req() req,

  ) {
    return await this.userService.getuserProject(req);
  }


  @UseGuards(JwtAuthGuard)
  @Get('work-order/:project_id')
  async get(
    @Param('project_id') project_id: string

  ) {
    return await this.userService.getProjectoder(project_id);
  }



}
