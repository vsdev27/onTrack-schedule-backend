import { Injectable } from '@nestjs/common';
import { CreateProjectsheetDto } from './dto/create-projectsheet.dto';
import { UpdateProjectsheetDto } from './dto/update-projectsheet.dto';

@Injectable()
export class ProjectsheetService {
  create(createProjectsheetDto: CreateProjectsheetDto) {
    return 'This action adds a new projectsheet';
  }

  findAll() {
    return `This action returns all projectsheet`;
  }

  findOne(id: number) {
    return `This action returns a #${id} projectsheet`;
  }

  update(id: number, updateProjectsheetDto: UpdateProjectsheetDto) {
    return `This action updates a #${id} projectsheet`;
  }

  remove(id: number) {
    return `This action removes a #${id} projectsheet`;
  }
}
