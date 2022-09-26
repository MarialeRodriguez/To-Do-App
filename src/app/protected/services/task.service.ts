import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, BehaviorSubject, Observable, of } from 'rxjs';
import { ITask } from 'src/app/auth/interfaces/task';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class TaskService {
  tasksKey = 'Tasks';
  private tasksSubject: BehaviorSubject<ITask[]>;
  public tasks: Observable<ITask[]> = of([]);
  constructor(private http: HttpClient) {
    this.tasksSubject = new BehaviorSubject<ITask[]>(
      JSON.parse(localStorage.getItem('Tasks')!)
    );
    this.tasks = this.tasksSubject.asObservable();
  }

  register(task: any) {
    return this.http
      .post<Task>(`${environment.apiUrl}/tasks/create`, task)
      .pipe(
        map((resp: any) => {
          this.tasksSubject.next(resp);
        })
      );
  }

  getAll(user_id: string) {
    return this.http.post<Task[]>(`${environment.apiUrl}/tasks`, { user_id });
  }

  getById(id: string) {
    return this.http.get<Task>(`${environment.apiUrl}/tasks/${id}`);
  }

  update(id: number, description: any) {
    return this.http
      .put<ITask[]>(`${environment.apiUrl}/tasks/${id}`, { description })
      .pipe(
        map((tasks) => {
          this.tasksSubject.next(tasks);
          return tasks;
        })
      );
  }

  deleteTask(id: number) {
    return this.http.delete<ITask[]>(`${environment.apiUrl}/tasks/${id}`).pipe(
      map((tasks) => {
        this.tasksSubject.next(tasks);
        return tasks;
      })
    );
  }
}