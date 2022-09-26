import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Route, RouterStateSnapshot, Router } from '@angular/router';
import { AuthService } from '../auth/services/auth.service';

@Injectable({
  providedIn: 'root'
})
export class ValidarTokenGuard implements CanActivate {

  constructor (private authService: AuthService,
               private router: Router){}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot) {
      
      const user = this.authService.userValue;

      if (user) {
        return true;
  }

  this.router.navigate(['/auth/login'], { queryParams: { returnUrl: state.url }});

  return false;

}
}