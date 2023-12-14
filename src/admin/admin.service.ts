import { HttpException, HttpStatus, Injectable } from '@nestjs/common';

import * as xlsx from 'xlsx';
import { InjectModel } from '@nestjs/mongoose';
import { ProjectSupervisor, ProjectSupervisorDocument } from 'src/admin/entities/project-supervisor.entity';
import { Model } from 'mongoose';
import * as fs from 'fs';
import * as path from 'path';
import { ExcelFileLink, ExcelFileLinkDocument } from './entities/excel-file.entity';
import { Project, ProjectDocument } from 'src/project/entities/project.entity';
import axios from 'axios';
import { User, UserDocument } from 'src/users/entities/user.entity';

@Injectable()
export class AdminService {
  constructor(

    @InjectModel(ProjectSupervisor.name) private projectsupModel: Model<ProjectSupervisorDocument>,
    @InjectModel(ExcelFileLink.name) private excelfileModel: Model<ExcelFileLinkDocument>,
    @InjectModel(Project.name) private projectModel: Model<ProjectDocument>

  ) { }


  async processExcelFile(request, file) {

    try {

      if (!file) {
        return {
          statusCode: HttpStatus.BAD_REQUEST,
          message: 'file not found',
        };
      }
      const allowedMimeTypes = ['application/vnd.ms-excel', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'];

      if (!allowedMimeTypes.includes(file.mimetype)) {
        return {
          statusCode: HttpStatus.BAD_REQUEST,
          message: 'File type is not valid, Please upload valid File',
        };
      }


      let uploadDir = path.join(process.cwd(), 'uploads/excelfile');
      console.log("up", uploadDir)
      if (!fs.existsSync(uploadDir)) {
        fs.mkdirSync(uploadDir, { recursive: true });
      }

      let filePath = path.join(uploadDir, file.originalname);

      // Save the file buffer to the specified path
      fs.writeFileSync(filePath, file.buffer);

      const fullUrl = `${request.protocol}://${request.get('host')}/uploads/excelfile/${file.originalname}`;

      const existingFile = await this.excelfileModel.findOne({ link: fullUrl });

      if (!existingFile) {
        let savefile = await this.excelfileModel.create({ name: file.originalname, link: fullUrl })
      }
      console.log("fri", fullUrl)

      //save supervisor in db
      await this.saveSupervisor(filePath)

      return {
        statusCode: 200,
        filePath: fullUrl,
        message: 'File uploaded Successfully',

      }

    } catch (error) {
      console.log('Error:', error);
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }

  }


  async saveSupervisor(filePath) {
    let workbook = xlsx.readFile(filePath);
    let sheetName = workbook.SheetNames[0];
    let worksheet = workbook.Sheets[sheetName];

    let data: any[][] = await xlsx.utils.sheet_to_json(worksheet, { header: 1 });

    let supervisorColumnIndex = data[2].indexOf('Supervisor');

    // if (supervisorColumnIndex === -1) {
    //   // Handle case where "Supervisor" column is not found
    //   throw new Error('Column "Supervisor" not found in the third row.');
    // }
    let supervisorValues = data.slice(3).map(row => row[supervisorColumnIndex]);
    let uniqueSupervisors = [];

    for (const value of supervisorValues) {
      if (value && !uniqueSupervisors.includes(value)) {
        uniqueSupervisors.push(value);
      }
    }
    let findata = await this.projectsupModel.find({}, { name: 1, _id: 0 });

    let existingSupervisors = findata.map(item => item.name);

    let newSupervisors = uniqueSupervisors.filter(supervisor => !existingSupervisors.includes(supervisor));
    let newSupervisorsObjects = newSupervisors.map(name => ({ name }));
    console.log("new", newSupervisorsObjects)


    let saveinfo = await this.projectsupModel.insertMany(newSupervisorsObjects)
    // return saveinfo
  }

  async getAllfiles(page, limit, search) {

    try {
      let skip = (page - 1) * limit;

      let query = this.excelfileModel.find()

      if (search) {
        query.or([
          { name: { $regex: new RegExp(search, 'i') } },
        ]);
      }

      let findAll = await query.skip(skip).limit(limit).sort({ createdAt: -1 }).exec();
      let totalCount = await this.excelfileModel.countDocuments({});

      return {
        statusCode: 200,
        totalCount: totalCount,
        data: findAll,
        message: 'Get files Successfully',
      }
    }

    catch (error) {
      console.log('Error:', error);
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }

  }

  async createProject(request, file, projectdata) {

    try {

      if (!file) {
        return {
          statusCode: HttpStatus.BAD_REQUEST,
          message: 'file not found',
        };
      }
      let data = JSON.parse((projectdata))

      const allowedMimeTypes = ['application/vnd.ms-excel', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'];

      if (!allowedMimeTypes.includes(file.mimetype)) {
        return {
          statusCode: HttpStatus.BAD_REQUEST,
          message: 'File type is not valid, Please upload valid File',
        };
      }

      const existingPr = await this.projectModel.findOne({ name: data.name });
      if (existingPr) {
        return {
          statusCode: HttpStatus.BAD_REQUEST,
          message: 'This project name is already taken, Please Enter unique name',
        };
      }


      let uploadDir = path.join(process.cwd(), 'uploads/excelfile');
      console.log("up", uploadDir)
      if (!fs.existsSync(uploadDir)) {
        fs.mkdirSync(uploadDir, { recursive: true });
      }

      let filePath = path.join(uploadDir, file.originalname);
      fs.writeFileSync(filePath, file.buffer);

      const fullUrl = `${request.protocol}://${request.get('host')}/uploads/excelfile/${file.originalname}`;
      data.baseFile_link = fullUrl
      data.baseFileName = file.originalname

      let saveinfo = await this.projectModel.create(data)

      return {
        statusCode: HttpStatus.CREATED,
        data: saveinfo,
        message: 'Created Project Successfully',

      }
    }
    catch (error) {
      console.log('Error:', error);
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }

  async getdataMap(projectId) {

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

      //const jsonData = xlsx.utils.sheet_to_json(worksheet, { header: 1 });
      const columnHeaders = this.getColumnHeaders(worksheet);
      //console.log("co",columnHeaders)

      const dataMap = {};
      columnHeaders.forEach(columnHeader => {
        dataMap[columnHeader] = worksheet[`${columnHeader}3`]?.v;
      });

      //delete temp file
      fs.unlinkSync(filePath);

      return {
        statusCode: 200,
        data: dataMap,
        message: 'Get data Successfully',

      };
    } catch (error) {
      console.log('Error:', error);
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }

  getColumnHeaders(worksheet: xlsx.WorkSheet) {
    const columnHeaders = [];
    const range = xlsx.utils.decode_range(worksheet['!ref']);
    for (let C = range.s.c; C <= range.e.c; ++C) {
      const col = xlsx.utils.encode_col(C);
      columnHeaders.push(col);
    }
    return columnHeaders;
  }

  async getAllProject(page, limit, search) {
    try {

      let skip = (page - 1) * limit;

      let query = this.projectModel.find()

      if (search) {
        query.or([
          { name: { $regex: new RegExp(search, 'i') } },
          { project_file_name: { $regex: new RegExp(search, 'i') } },
          { base_file_name: { $regex: new RegExp(search, 'i') } },
        ]);
      }

      let findAll = await query.skip(skip).limit(limit).sort({ createdAt: -1 }).exec();
      let totalCount = await this.projectModel.countDocuments({});

      return {
        statusCode: 200,
        totalCount: totalCount,
        data: findAll,
        message: 'Get Projects Successfully',
      }
    }

    catch (error) {
      console.log('Error:', error);
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }

  async getProject(project_id) {
    try {

      let findpr = await this.projectModel.findOne({ _id: project_id })

      if (!findpr) {
        return {
          statusCode: HttpStatus.BAD_REQUEST,
          message: 'Project not found',
        };
      }



      return {
        statusCode: 200,
        data: findpr,
        message: 'Get Project Successfully',

      }
    }

    catch (error) {
      console.log('Error:', error);
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }

  async editProject(request, project_id, file, projectdata) {

    try {
      let data = JSON.parse((projectdata))

      if (file) {
        const allowedMimeTypes = ['application/vnd.ms-excel', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'];

        if (!allowedMimeTypes.includes(file.mimetype)) {
          return {
            statusCode: HttpStatus.BAD_REQUEST,
            message: 'File type is not valid, Please upload valid File',
          };
        }

        let uploadDir = path.join(process.cwd(), 'uploads/excelfile');
        console.log("up", uploadDir)
        if (!fs.existsSync(uploadDir)) {
          fs.mkdirSync(uploadDir, { recursive: true });
        }

        let filePath = path.join(uploadDir, file.originalname);
        fs.writeFileSync(filePath, file.buffer);

        const fullUrl = `${request.protocol}://${request.get('host')}/uploads/excelfile/${file.originalname}`;
        data.baseFile_link = fullUrl
        data.baseFileName = file.originalname

      }

      if (data.name) {
        const existingPr = await this.projectModel.findOne({ name: data.name,_id: { $ne: project_id } });
        if (existingPr) {
          return {
            statusCode: HttpStatus.BAD_REQUEST,
            message: 'This project name is already taken, Please Enter unique name',
          };
        }
      }

      let updateinfo = await this.projectModel.findOneAndUpdate(
        { _id: project_id },
        data,
        {
          new: true,
        },)

      return {
        statusCode: HttpStatus.CREATED,
        data: updateinfo,
        message: 'Update Project Successfully',

      }
    }
    catch (error) {
      console.log('Error:', error);
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }

  async deleteProject(project_id) {
    try {

      let findpr = await this.projectModel.findByIdAndDelete(project_id)

      return {
        statusCode: 200,
        message: 'Delete Project Successfully',
      }
    }

    catch (error) {
      console.log('Error:', error);
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }


  


}
