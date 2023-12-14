import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { User, UserDocument } from './entities/user.entity';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { CreateUserDto } from './dto/create-user.dto';

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(User.name) private userModel: Model<UserDocument>,
    private jwtService: JwtService,
  ) {}

  async create(createUserDto) {
    try {

      const userData = await this.userModel.findOne({
        username: createUserDto.username,
      });

      if (userData) {

        return {
          statusCode: HttpStatus.BAD_REQUEST,
          message: 'User already exists by email/username',
        };
        
      }
      createUserDto.roles= 'user'
    //  const newPassword = await bcrypt.hash(createUserDto.password, 10);
      const user = await this.userModel.create(createUserDto);
     

      return {
        statusCode: HttpStatus.CREATED,
        message: 'User Created successfully',
        data: user,
      };
    } catch (error) {
      console.log(' user create', error);
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }

  async getAlluser(page, limit, search) {
    try {

      let skip = (page - 1) * limit;

      let query = this.userModel.find()

      if (search) {
        query.or([
          { username: { $regex: new RegExp(search, 'i') } },
      
        ]);
      }

      let findAll = await query.skip(skip).limit(limit).sort({ createdAt: -1 }).exec();
      let totalCount = await this.userModel.countDocuments({});

      return {
        statusCode: 200,
        totalCount: totalCount,
        data: findAll,
        message: 'Get Users Successfully',
      }
    }

    catch (error) {
      console.log('Error:', error);
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }

  async getUser(user_id) {
    try {

      let finduser = await this.userModel.findOne({ _id: user_id })

      if (!finduser) {
        return {
          statusCode: HttpStatus.BAD_REQUEST,
          message: 'User not found',
        };
      }


      return {
        statusCode: 200,
        data: finduser,
        message: 'Get User Successfully',

      }
    }

    catch (error) {
      console.log('Error:', error);
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }

  async updateUser( user_id, data) {

    try {

      if (data.username) {
        const existingPr = await this.userModel.findOne({ username: data.username,_id: { $ne: user_id } });
        if (existingPr) {
          return {
            statusCode: HttpStatus.BAD_REQUEST,
            message: 'This  username is already taken, Please Enter unique name',
          };
        }
      }

      let updateinfo = await this.userModel.findOneAndUpdate(
        { _id: user_id },
        data,
        {
          new: true,
        },)

      return {
        statusCode: HttpStatus.OK,
        data: updateinfo,
        message: 'Update user Successfully',

      }
    }
    catch (error) {
      console.log('Error:', error);
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }

  async deleteUser(user_id) {
    try {

      let findpr = await this.userModel.findByIdAndDelete(user_id)

      return {
        statusCode: 200,
        message: 'Delete user Successfully',
      }
    }

    catch (error) {
      console.log('Error:', error);
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }


  async findbyProject(page,limit,project_id) {
    try {

      let skip = (page - 1) * limit;

      let finduser = await this.userModel.find({ projects: project_id }).skip(skip).limit(limit).sort({ createdAt: -1 }).exec()

      return {
        statusCode: 200,
        totalCount: finduser.length,
        data: finduser,
        message: 'Get User Successfully',

      }
    }

    catch (error) {
      console.log('Error:', error);
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }






  async getUserFromToken(request) {
    let authHeader = request.headers.authorization;
    const decodedJwt = this.jwtService.decode(authHeader.split(' ')[1]) as any;
    const user = await this.userModel.findOne({ _id: decodedJwt?.id });
    if (!user) {
      throw new HttpException('Invalid token', HttpStatus.UNAUTHORIZED);
    }
    return user;
  }




 


}
