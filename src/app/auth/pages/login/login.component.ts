import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { first } from 'rxjs/operators';
import { AuthService } from '../../services/auth.service';

import Swal from 'sweetalert2';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  hide = true;
  loading = false;
  submitted = false;
  miFormulario = this.fb.group({
    email: ['', [Validators.required, Validators.email ] ],
    password1: ['', [Validators.required, Validators.minLength(7), Validators.pattern(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])[a-zA-Z0-9\d@$.!%*#?&]/,)]]
  });

  constructor(private fb: FormBuilder,
              private router: Router,
              private route: ActivatedRoute,
              private authService: AuthService){}

  ngOnInit(): void {}
  
  get f() {
    return this.miFormulario.controls;
  }

  login(){
    
    this.submitted = true;
    if (this.miFormulario.invalid){ 
      Swal.fire({
        icon: 'warning',
        title: 'Error',
        text: 'Please fill in the required fields ',
      })
      return; }

    this.authService.login(this.f.email.value!, this.f.password1.value!)
        .pipe(first())
        .subscribe({
          next: () => { 
            Swal.fire({
              position: 'center',
              icon: 'success',
              title: 'Successfully authenticated',
              showConfirmButton: false,
              timer: 1500
            })
            const returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/dashboard';
            console.log(returnUrl);
            this.router.navigateByUrl(returnUrl);
          },
          error: (err) => {
            Swal.fire({
              icon: 'error',
              title: 'Oops...',
              text: 'Invalid user',
            })
            this.loading = false;
          }
        });
  }

  }
