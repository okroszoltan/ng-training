import { Component, OnInit } from '@angular/core';

import {
  Task,
  MoveableTask,
  TaskService
} from '../../task.barrel';

@Component({
  selector: 'app-task-list',
  templateUrl: './task-list.component.html',
  styleUrls: ['./task-list.component.css']
})
export class TaskListComponent implements OnInit {
  public tasks: Task[];
  public loading: boolean = true;

  public constructor(private _taskService: TaskService) {
    //
  }

  public ngOnInit() {
    this.loadTasks();
  }

  public loadTasks() {
    this.loading = true;
    this._taskService.list({
      success: response => this.tasks = response,
      finally: () => this.loading = false
    });
  }

  public addNewTask() {
    this.loading = true;
    let task = new Task();
    task.name = 'New Task';
    this._taskService.create(
      task,
      {
        success: newTask => {
          task = newTask;
          task.position = this.tasks.length;
          this._taskService.update(
            task,
            {
              success: updatedTask => this.loadTasks(),
              error: error => this.loadTasks(),
              finally: () => this.loading = false
            }
          );
        },
        finally: () => this.loadTasks()
      }
    )
  }

  public removeTask(task: Task) {
    const index: number = this.tasks.indexOf(task);
    if (index !== -1) {
      this.tasks.splice(index, 1);
      for (let i = this.tasks.length - 1; i >= index; i--) {
        this.tasks[i].position -= 1;
        this._taskService.update(
          this.tasks[i],
          {
            success: updatedTask => task = updatedTask,
            error: error => this.loadTasks(),
            finally: () => this.loading = false
          }
        )
      }
    }
  }

  public moveTasks(moveableTask: MoveableTask) {
    if (moveableTask.task.position + moveableTask.offset < 0) {
      alert('Feljebb nem mehet!');
      this.loadTasks();
    } else if (moveableTask.task.position + moveableTask.offset >= this.tasks.length) {
      alert('Lejjebb nem mehet!');
      this.loadTasks();
    }
    const index: number = this.tasks.indexOf(moveableTask.task);
    if (index !== -1) {
      moveableTask.task.position += moveableTask.offset;
      for (const otherTask of this.tasks) {
        if (otherTask.position === moveableTask.task.position && otherTask.id !== moveableTask.task.id) {
          this.loading = true;
          otherTask.position -= moveableTask.offset;
          this._taskService.update(
            moveableTask.task,
            {
              success: updatedTask => {
                this.loading = true;
                this._taskService.update(
                  otherTask,
                  {
                    success: updatedOtherTask => this.loadTasks(),
                    error: error => this.loadTasks(),
                    finally: () => this.loading = false
                  }
                );
              },
              error: error => this.loadTasks(),
              finally: () => this.loading = false
            }
          )
        }
     }
    }
  }

}


