import { Module } from '@nestjs/common';
import { AdminService } from './admin.service';
import { AdminController } from './admin.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { ProjectSupervisor, ProjectSupervisorSchema } from 'src/admin/entities/project-supervisor.entity';
import { ExcelFileLink, ExcelFileLinkSchema } from './entities/excel-file.entity';
import { Project, ProjectSchema } from 'src/project/entities/project.entity';
import { User, UserSchema } from 'src/users/entities/user.entity';

@Module({
  imports: [

    MongooseModule.forFeature([{ name: ProjectSupervisor.name, schema:ProjectSupervisorSchema }]),
    MongooseModule.forFeature([{ name: ExcelFileLink.name, schema:ExcelFileLinkSchema }]),
    MongooseModule.forFeature([{ name: Project.name, schema:ProjectSchema }]),

  ],
  controllers: [AdminController],
  providers: [AdminService],
})
export class AdminModule {}
