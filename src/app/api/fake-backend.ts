import { Injectable } from '@angular/core';
import {HttpRequest,HttpResponse,HttpHandler,HttpEvent,HttpInterceptor,HTTP_INTERCEPTORS} from '@angular/common/http';
import { Observable, of, throwError } from 'rxjs';
import { delay, materialize, dematerialize } from 'rxjs/operators';
import { ITask } from '../auth/interfaces/task';

const usersKey = 'Users';
const tasksKey = 'Tasks';
let users = JSON.parse(localStorage.getItem(usersKey)!) || [];
let tasks = JSON.parse(localStorage.getItem(tasksKey)!) || [];

@Injectable()
export class FakeBackendInterceptor implements HttpInterceptor {
  intercept(
    request: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    const { url, method, headers, body } = request;

    return handleRoute();

    function handleRoute() {
      switch (true) {
        case url.endsWith('/users/authenticate') && method === 'POST':
          return authenticate();
        case url.endsWith('/users/register') && method === 'POST':
          return register();
        case url.endsWith('/users') && method === 'GET':
          return getUsers();
        case url.match(/\/users\/\d+$/) && method === 'GET':
          return getUserById();
        case url.match(/\/users\/\d+$/) && method === 'PUT':
          return updateUser();
        case url.match(/\/users\/\d+$/) && method === 'DELETE':
          return deleteUser();
          case url.endsWith('/tasks/create') && method === 'POST':
          return createTask();
        case url.endsWith('/tasks') && method === 'POST':
          return getTasks();
        case url.match(/\/tasks\/\d+$/) && method === 'GET':
          return getTaskById();
        case url.match(/\/tasks\/\d+$/) && method === 'PUT':
          return updateTask();
        case url.match(/\/tasks\/\d+$/) && method === 'DELETE':
          return deleteTask();
        default:
          
          return next.handle(request);
      }
    }



    function authenticate() {
      const { email, password1 } = body;
      const user = users.find(
        (x: any) => x.email === email && x.password1 === password1
      );
      if (!user) return error('Email or password is incorrect');
      return ok({
        ...basicDetails(user),
        token: 'fake-jwt-token',
      });
    }



    function register() {
      const user = body;

      if (users.find((x: any) => x.userName === user.userName)) {
        return error('UserName "' + user.userName + '" is already taken');
      }

      user.id = users.length ? Math.max(...users.map((x: any) => x.id)) + 1 : 1;
      users.push(user);
      localStorage.setItem(usersKey, JSON.stringify(users));
      return ok();
    }

    function getUsers() {
      if (!isLoggedIn()) return unauthorized();
      return ok(users.map((x: any) => basicDetails(x)));
    }

    function getUserById() {
      if (!isLoggedIn()) return unauthorized();

      const user = users.find((x: any) => x.id === idFromUrl());
      return ok(basicDetails(user));
    }

    function updateUser() {
      if (!isLoggedIn()) return unauthorized();

      let params = body;
      let user = users.find((x: any) => x.id === idFromUrl());


      if (!params.password1) {
        delete params.password1;
      }


      Object.assign(user, params);
      localStorage.setItem(usersKey, JSON.stringify(users));

      return ok();
    }

    function deleteUser() {
      if (!isLoggedIn()) return unauthorized();

      users = users.filter((x: any) => x.id !== idFromUrl());
      localStorage.setItem(usersKey, JSON.stringify(users));
      return ok();
    }



    function createTask() {
      const task = body;

      if (tasks.find((x: any) => x.description === task.description)) {
        return error('Task "' + task.description + '" is already taken');
      }

      task.id = tasks.length ? Math.max(...tasks.map((x: any) => x.id)) + 1 : 1;
      tasks.push(task);
      localStorage.setItem(tasksKey, JSON.stringify(tasks));
      return ok(tasks);
    }

    function getTasks() {
      if (!isLoggedIn()) return unauthorized();
      const { user_id } =  body;

      return ok(tasks.filter((x: any) => x.user_id === user_id));
    }

    function getTaskById() {
      if (!isLoggedIn()) return unauthorized();

      const task = tasks.find((x: any) => x.id === idFromUrl());
      return ok(basicTaskDetails(task));
    }
    function updateTask() {
        if (!isLoggedIn()) return unauthorized();

        const { description } =  body;

        if (!description) {
          return error(' Description is empty');
        }
  
        tasks = tasks.map((task: ITask) => {
          if (task.id === idFromUrl()) {
            return { ...task, description };
          }
          return task;
        });

        localStorage.setItem(tasksKey, JSON.stringify(tasks));
        return ok(tasks);
      }
  
      function deleteTask() {
        if (!isLoggedIn()) return unauthorized();
  
        tasks = tasks.filter((x: any) => x.id !== idFromUrl());
        localStorage.setItem(tasksKey, JSON.stringify(tasks));
        return ok(tasks);
      }
  
      function ok(body?: any) {
        return of(new HttpResponse({ status: 200, body })).pipe(delay(500)); 
      }
  
      function error(message: string) {
        return throwError({ error: { message } }).pipe(
          materialize(),
          delay(500),
          dematerialize()
        ); 
      }
  
      function unauthorized() {
        return throwError({
          status: 401,
          error: { message: 'Unauthorized' },
        }).pipe(materialize(), delay(500), dematerialize());
      }
  
      function basicDetails(user: any) {
        const { id, email, userName, firstName, lastName } = user;
        return { id, email, userName, firstName, lastName };
      }
  
      function basicTaskDetails(task: any) {
        const { id, description } = task;
        return { id, description };
      }
  
      function isLoggedIn() {
        return headers.get('Authorization') === 'Bearer fake-jwt-token';
      }
  
      function idFromUrl() {
        const urlParts = url.split('/');
        return parseInt(urlParts[urlParts.length - 1]);
      }
    }
  }
  
  export const fakeBackendProvider = {

    provide: HTTP_INTERCEPTORS,
    useClass: FakeBackendInterceptor,
    multi: true,
  };