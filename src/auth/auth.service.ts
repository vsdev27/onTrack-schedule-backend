import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectModel } from '@nestjs/mongoose';
import * as bcrypt from 'bcrypt';
import * as jwt from 'jsonwebtoken';
import { Model } from 'mongoose';
import { CreateUserDto } from 'src/users/dto/create-user.dto';
import { User, UserDocument } from 'src/users/entities/user.entity';

@Injectable()
export class AuthService {
  constructor(
    @InjectModel(User.name) private userModel: Model<UserDocument>,
    private jwtService: JwtService,
  ) {}

  async loginadmin(username, password) {
 

    const user = await this.userModel.findOne({ username });
    if (!user) {
      throw new HttpException(
        {
          status: HttpStatus.OK,
          message: 'Account not found',
        },
        HttpStatus.OK,
      );
    }
    const passwordMatch = await bcrypt.compare(password, user.password);
    if (!passwordMatch) {
      throw new HttpException(
        {
          status: HttpStatus.OK,
          message: 'Invalid credentials',
        },
        HttpStatus.OK,
      );
    }
    user.roles = 'admin';
    await user.save();
    const payload = { username: user.username, id: user._id, roles: user.roles };

    const accessToken = this.jwtService.sign(payload, {
      secret:process.env.JWT_SEC,
    });

    return {
      status: HttpStatus.OK,
      message: 'User logged in successfully',
      user: {
        id: user._id,
        username: user.username,
        roles: user.roles,
      },
      accessToken,
    };
 
  }



  async userlogin(username: any, password: string) {
    const userData = await this.userModel.findOne({ username });

    if (!userData) {
      throw new HttpException('User not found', HttpStatus.BAD_REQUEST);
    }

  
    const isPasswordMatching = await this.userModel.findOne({ username ,password});


    if (!isPasswordMatching) {
      throw new HttpException('Password mismatch', HttpStatus.BAD_REQUEST);
    }
    const token = this.jwtService.sign(
      {
        id: userData._id,
      },
      {
        secret: process.env.JWT_SEC,
        expiresIn: '24h',
      },
    );

    return {
      statusCode: HttpStatus.OK,
      message: 'Successfully logged in',
      data: userData,
      token: token,
    };
  }
}
