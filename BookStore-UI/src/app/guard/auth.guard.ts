import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { NgToastService } from 'ng-angular-popup';
import { AuthService } from '../services/auth-service/auth.service';

@Injectable({
  providedIn: 'root'
})
export class authGuard implements CanActivate {
  constructor(private auth: AuthService, private route: Router, private toast: NgToastService) {

  }
  canActivate(): boolean {
    if (this.auth.isLoggedIn() && this.auth.getRoleFromToken() !== "Admin") {
      return true;
    }
    else {
      this.toast.error({ detail: 'Error', summary: "", duration: 3000, });
      this.route.navigate(['login'])
      return false;
    }
  }
}
