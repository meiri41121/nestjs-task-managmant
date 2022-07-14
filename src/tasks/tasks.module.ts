import { Module } from '@nestjs/common';
import { TaskRepository } from './task.repository';
import { TasksController } from './tasks.controller';
import { TasksService } from './tasks.service';
import { TypeOrmExModule } from '../database/typeorm-ex.module';

@Module({
  imports: [TypeOrmExModule.forCustomRepository([TaskRepository])],
  controllers: [TasksController],
  providers: [TasksService],
})
export class TasksModule {}
