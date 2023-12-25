import { Module, forwardRef } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from './entities/user.entity';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { ProjectSupervisor, ProjectSupervisorSchema } from 'src/admin/entities/project-supervisor.entity';
import { Project, ProjectSchema } from 'src/project/entities/project.entity';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
    MongooseModule.forFeature([{ name: ProjectSupervisor.name, schema:ProjectSupervisorSchema }]),
    MongooseModule.forFeature([{ name: Project.name, schema:ProjectSchema }]),

  ],
  controllers: [UsersController],
  providers: [UsersService, JwtService],
  exports: [UsersService],
})
export class UsersModule {}
