import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { first } from 'rxjs/operators';
import { AuthService } from '../../services/auth.service';

import Swal from 'sweetalert2';
import { ValidatorComponent } from '../../validator/validator.component';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent implements OnInit {

  hide = true;
  hideConfirm = true;
  loading = false;
  submitted= false;

  miFormulario = this.fb.group({
    userName: ['', [Validators.required, Validators.minLength(5) ]],
    firstName: ['', [Validators.required, Validators.minLength(5) ]],
    lastName: ['', [Validators.required, Validators.minLength(5) ]],
    email: ['', [Validators.required, Validators.email ]],
    password1: ['', [Validators.required, Validators.minLength(7), Validators.pattern(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])[a-zA-Z0-9\d@$.!%*#?&]/,)]],
    confirmPassword1: ['', [Validators.required]]
  }, {
    validator: ValidatorComponent.MatchPassword
  });

    constructor(private fb: FormBuilder,
                private authService: AuthService,
                private router: Router,
                private route: ActivatedRoute) {}
            
    ngOnInit(): void {}


 register(){ 
  if ( this.miFormulario.invalid){
    Swal.fire({
      icon: 'warning',
      title: 'Error',
      text: 'Please fill in the required fields ',
    })
    return;
  }

  const {userName, firstName, lastName, email, password1} = this.miFormulario.value;

  let user = {
    userName,
    firstName,
    lastName,
    email,
    password1
  };

  this.authService.register(user)
    .pipe(first())
    .subscribe({
      next: () => {
        Swal.fire({
          icon: 'success',
          title: 'User successfully registered',
          text: '',
        })
        this.router.navigate(['../auth/login'], { relativeTo: this.route });
      },
      error: (error) => {
        this.loading = false;
      }
    });
}


}
