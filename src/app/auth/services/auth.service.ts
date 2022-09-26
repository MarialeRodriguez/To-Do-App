import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

import {  BehaviorSubject, Observable } from 'rxjs'; 
import { map } from 'rxjs/operators'; 
import { Router } from '@angular/router';
import { User } from '../interfaces/user';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

private userSubject: BehaviorSubject<User>;
  public user: Observable<User>;

  constructor(private router: Router, private http: HttpClient) {
    this.userSubject = new BehaviorSubject<User>(
      JSON.parse(localStorage.getItem('user')!)
    );
    this.user = this.userSubject.asObservable();
  }

  public get userValue(): User {
    return this.userSubject.value;
  }

  login(email: string, password1: string) {
    return this.http
      .post<User>(`${environment.apiUrl}/users/authenticate`, {
        email,
        password1,
      })
      .pipe(
        map((user: any) => {
          
          localStorage.setItem('user', JSON.stringify(user));
          this.userSubject.next(user);
          return user;
        })
      );
  }

  logout() {
    
    console.info('logout');
    localStorage.removeItem('user');
    this.userSubject.next(null!);
    this.router.navigate(['/auth/login']);
  }

  register(user: any) {
    return this.http.post(`${environment.apiUrl}/users/register`, user);
  }
}
