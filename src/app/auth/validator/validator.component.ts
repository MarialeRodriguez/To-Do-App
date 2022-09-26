import { Component } from '@angular/core';
import { AbstractControl } from '@angular/forms';

@Component({
  selector: 'app-validator',
  templateUrl: './validator.component.html',
  styleUrls: ['./validator.component.scss']
})
export class ValidatorComponent {
// @ts-ignore
  static MatchPassword(AC: AbstractControl) {
    let password1 = AC.get('password1')?.value;

    if(AC.get('confirmPassword1')?.touched || AC.get('confirmPassword1')?.dirty) {
      let verifyPassword1 = AC.get('confirmPassword1')?.value;

      if(password1 != verifyPassword1) {
        AC.get('confirmPassword1')?.setErrors( {MatchPassword: true} )
        }else{
          return null;
        }
    }
        
  }

  

}
