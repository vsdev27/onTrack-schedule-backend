import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { User, UserDocument } from './entities/user.entity';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import * as fs from 'fs';
import * as path from 'path';
import axios from 'axios';
import * as xlsx from 'xlsx';
import { CreateUserDto } from './dto/create-user.dto';
import { ProjectSupervisor, ProjectSupervisorDocument } from 'src/admin/entities/project-supervisor.entity';
import { Project, ProjectDocument } from 'src/project/entities/project.entity';

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(User.name) private userModel: Model<UserDocument>,
    @InjectModel(Project.name) private projectModel: Model<ProjectDocument>,
    @InjectModel(ProjectSupervisor.name) private projectsupModel: Model<ProjectSupervisorDocument>,

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

      let query = this.userModel.find({username: { $ne: 'admin' } })

      if (search) {
        query.or([
          { username: { $regex: new RegExp(search, 'i') } },
      
        ]);
      }

      let findAll = await query.skip(skip).limit(limit).sort({ createdAt: -1 }).exec();
      let totalCount = await this.userModel.countDocuments({username: { $ne: 'admin' } });

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
      console.log("s",project_id)
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

async getallSupervisors(){
  try {

    let findsup= await this.projectsupModel.find()

    
    return {
      statusCode: 200,
      data: findsup,

    }
  }

  catch (error) {
    console.log('Error:', error);
    throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
  }
}

  async getuserProject(req) {
    try {

      let userdata= await this.getUserFromToken(req)

      if(userdata.projects && userdata.projects.length>0){

        const projectIds = userdata.projects

        const projects = await this.projectModel.find({ _id: { $in: projectIds } }).exec();

        return{
          statusCode: HttpStatus.OK,
          data:projects,
        message: 'Get projects successfully'
        }

      }


      return {
        statusCode: HttpStatus.BAD_REQUEST,
        message: 'No projects found ',
      }
    }

    catch (error) {
      console.log('Error:', error);
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }


  async getProjectoder(projectId) {

      // Work Order Number
     // Operation Number
    // Activity Name

    try {
      const project = await this.projectModel.findById(projectId);

      if (!project) {
        return {
          statusCode: HttpStatus.BAD_REQUEST,
          message: 'Project not found',
        };
      }

      const response = await axios.get(project.projectfile_link, { responseType: 'arraybuffer' });

      let uploadDir = path.join(process.cwd(), 'uploads/excelfile');

      const random4DigitNumber = Math.floor(1000 + Math.random() * 9000);
      const filename = `${random4DigitNumber}_temp.xlsx`;

      let filePath = path.join(uploadDir, filename);
      fs.writeFileSync(filePath, response.data);

      const workbook = xlsx.readFile(filePath);
      const sheetName = workbook.SheetNames[0];
      const worksheet = workbook.Sheets[sheetName];

      // const jsonData = xlsx.utils.sheet_to_json(worksheet, { header: 1 });
      const columnNames : any= xlsx.utils.sheet_to_json(worksheet, { header: 1 })[2];

      const jsonData = xlsx.utils.sheet_to_json(worksheet, { header: columnNames, range: 3 });
      

      const result = jsonData
      .filter(row => row['Project Name'] === project.name)
      .map(row => ({
        'Work Order Number': row['Work Order Number'],
        'Operation Number': row['Operation Number'],
        'Activity Name': row['Activity Name'] || '',
      }));
      //delete temp file
      fs.unlinkSync(filePath);

      return {
        statusCode: 200,
        data: result,
        message: 'Get data Successfully',

      };
    } catch (error) {
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
