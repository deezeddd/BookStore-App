import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { NgToastService } from 'ng-angular-popup';
import { UserStoreService } from '../services/user-store-service/user-store.service';
import { AuthService } from '../services/auth-service/auth.service';


@Injectable({
  providedIn: 'root'
})
export class RoleGuard implements CanActivate {
  constructor(private auth: AuthService, private userStore: UserStoreService, private route: Router) {
  }
  Role: any;
  canActivate(): boolean {
    this.userStore.getRoleFromStore().subscribe(val => {
      let roleFromToken = this.auth.getRoleFromToken()
      this.Role = val || roleFromToken;
    })
    if (this.Role == "Admin")
      return true;
    else {
      this.route.navigate(['']);
      return false;
    }
  }
}
