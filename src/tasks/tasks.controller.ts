// eslint-disable-next-line prettier/prettier
import { Body, Controller, Delete, Get, Logger, Param, ParseIntPipe, Patch, Post, Query, Req, UseGuards, UsePipes, ValidationPipe } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { CreateTaskDto } from './dto/create-task.dto';
import { GetTaskFilterDto } from './dto/get-tasks-filter.dto';
import { TaskStatusValidationPipe } from './pipes/task-status-validation.pipes';
import { TaskStatus } from './task-status.enum';
import { Task } from './task.entity';
import { TasksService } from './tasks.service';

@Controller('tasks')
@UseGuards(AuthGuard())
export class TasksController {
  private logger = new Logger('TasksController');
  constructor(private taskService: TasksService) {}

  @Get()
  getTasks(
    @Query(ValidationPipe) filterDto: GetTaskFilterDto,
    @Req() req,
  ): Promise<Task[]> {
    this.logger.verbose(
      'User ' +
        req.user.username +
        ' retrieving all tasks. Filters: ' +
        JSON.stringify(filterDto),
    );
    return this.taskService.getTasks(filterDto, req.user);
  }

  @Get('/:id')
  getTaskById(
    @Param('id', ParseIntPipe) id: number,
    @Req() req,
  ): Promise<Task> {
    return this.taskService.getTaskById(id, req.user);
  }

  @Post()
  @UsePipes(ValidationPipe)
  createTask(@Body() createTaskDto: CreateTaskDto, @Req() req): Promise<Task> {
    this.logger.verbose(
      'User ' +
        req.user.username +
        ' creating a new task. Data: ' +
        JSON.stringify(createTaskDto),
    );
    return this.taskService.createTask(createTaskDto, req.user);
  }

  @Delete('/:id')
  deleteTaskById(
    @Param('id', ParseIntPipe) id: number,
    @Req() req,
  ): Promise<void> {
    return this.taskService.deleteTask(id, req.user);
  }

  @Patch('/:id/status')
  updateTaskStatus(
    @Param('id', ParseIntPipe) id: number,
    @Body('status', TaskStatusValidationPipe) status: TaskStatus,
    @Req() req,
  ): Promise<Task> {
    return this.taskService.updateTaskStatus(id, status, req.user);
  }
}
