import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { first } from 'rxjs/operators';
import { ITask } from 'src/app/auth/interfaces/task';
import { AuthService } from 'src/app/auth/services/auth.service';

import Swal from 'sweetalert2';
import { TaskService } from '../services/task.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
})
export class DashboardComponent {

  isLoading = false;

  miTODO = this.fb.group({
    description: ['', Validators.required],
  });

  id: string | null = null;
  edit: boolean = false;
  taskId: number | null = null;

  constructor(private fb: FormBuilder, 
              private taskService: TaskService,
              private authService: AuthService) {

          this.id = this.authService.userValue.id;
        }

  get f(){
    return this.miTODO.controls;
  }

  onSubmit(){
    if(this.miTODO.invalid) return;

    this.isLoading = true;
    if(this.edit) {
      this.updateTask();
    } else {
      this.guardar();
    }
  }

  guardar() {
    let task = { description: this.f.description.value, user_id: this.id };

    this.taskService
      .register(task)
      .pipe(first())
      .subscribe({
        next: () => {
          this.miTODO.reset();
          this.miTODO.controls['description'].setErrors(null);
          this.isLoading = false;
        },
        error: ( error ) => {
          this.isLoading = false;
        }
      });
  }

  updateTask() {
    this.taskService
      .update(this.taskId!, this.f.description.value)
      .pipe(first())
      .subscribe({
        next: () => {
          this.edit = false;
          this.miTODO.reset();
          this.miTODO.controls['description'].setErrors(null);
          this.isLoading = false;
        },
        error: (error) => {
          this.isLoading = false;
        }
      })
  }

  selectedTask(task: ITask) { 
    this.miTODO.controls['description'].setValue(task.description);
    this.taskId = task.id;
    this.edit = true;
  }

  logout() {
    Swal.fire({
      title: 'Are you sure?',
      text: "Session will close!",
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, log out!'
    }).then((result) => {
      if (result.isConfirmed) {
        Swal.fire(
          'Session closed!',
          '',
          'success'
        )
        this.authService.logout();
      }
    })
    
  }
}
