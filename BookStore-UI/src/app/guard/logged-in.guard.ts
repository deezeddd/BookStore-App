import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from '@angular/router';

import { AuthService } from '../services/auth-service/auth.service';
// import { NotfoundComponent } from '../MyComponents/GeneralComponents/notfound/notfound.component';

@Injectable({
  providedIn: 'root'
})
export class LoggedInGuard implements CanActivate {
  constructor(private auth: AuthService, private route: Router) { }
  canActivate() {
    if (!this.auth.isLoggedIn()) {
      return true;
    }
    else {
      this.route.navigate(['']);
      return false;
    }
  }

}
