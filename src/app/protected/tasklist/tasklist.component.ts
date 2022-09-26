import { first } from 'rxjs/operators';
import { Component, Input, OnInit, Output, EventEmitter } from '@angular/core';
import { AuthService } from 'src/app/auth/services/auth.service';
import { TaskService } from '../services/task.service';
import { ITask } from 'src/app/auth/interfaces/task';

import Swal from 'sweetalert2';

@Component({
  selector: 'app-tasklist',
  templateUrl: './tasklist.component.html',
  styleUrls: ['./tasklist.component.scss'],
})
export class TasklistComponent implements OnInit {
  id: string | null = null;
  @Input() tasksList: any[] = [];
  @Output() newTaskEvent = new EventEmitter<ITask>();

  constructor(
    private taskService: TaskService,
    private authService: AuthService
  ) {
    this.id = this.authService.userValue.id;
  }

  ngOnInit(): void {
    this.getTasks();
    this.taskService.tasks.subscribe((tasks) => {
      this.tasksList = tasks;
    });
  }

  getTasks() {
    this.taskService
      .getAll(this.id!)
      .pipe(first())
      .subscribe((tasks) => {
        this.tasksList = tasks;
      });
  }

  edit(task: ITask): void {
    this.newTaskEvent.emit(task);
  }

  deleteTask(id: number): void {
    Swal.fire({
      title: 'Are you sure?',
      text: "Delete task!",
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, delete!'
    }).then((result) => {
      if (result.isConfirmed) {
        Swal.fire(
          'Task successfully removed!',
          '',
          'success'
        )
        this.taskService
      .deleteTask(id)
      .pipe(first())
      .subscribe((tasks) => {
      });
      }
    })
    
  }
}