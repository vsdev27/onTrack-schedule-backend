import { Controller, Post, Query, HttpCode, Get, Body } from '@nestjs/common';
import { AuthService } from './auth.service';
import { ApiQuery, ApiTags } from '@nestjs/swagger';
import { CreateUserDto } from 'src/users/dto/create-user.dto';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  

  @HttpCode(200)
  @Post('user/login')
  login(
    @Query('username') username: string, 
    @Query('password') password: string) {
    return this.authService.userlogin(username, password);
  }

  @HttpCode(200)
  @Post('admin/login')
  loginAdmin(
    @Query('username') username: string,
    @Query('password') password: string,
  ) {
    return this.authService.loginadmin(username, password);
  }

  
}
