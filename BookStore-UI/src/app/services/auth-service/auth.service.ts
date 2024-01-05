import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject, Observable } from 'rxjs';
import { UserStoreService } from '../user-store-service/user-store.service';
import { JwtHelperService } from '@auth0/angular-jwt';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private baseUrl:String ="https://localhost:7275/api/Account/"
  private userPayLoad: any;
  constructor(private http: HttpClient, private route: Router, private userStore: UserStoreService) {
    this.userPayLoad = this.decodedToken();
  }

  private loggedInSubject: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  public loggedIn$: Observable<boolean> = this.loggedInSubject.asObservable();

  public updateLoggedInStatus(loggedIn: boolean): void {
    console.log("observable -> ",loggedIn);
    this.loggedInSubject.next(loggedIn);     // Next Used to send it to other components
  }


  register(userObj: any) {
    return this.http.post<any>(`${this.baseUrl}register`, userObj)
  }
  login(userObj: any) {
    return this.http.post<any>(`${this.baseUrl}login`, userObj)
  }

  isAuthenticated() {
    return this.http.get(`${this.baseUrl}IsAuthenticated`);
  }

  signOut() {
    localStorage.clear();
    this.route.navigate([''])
    this.updateLoggedInStatus(false);
  }


  // to store token
  storeToken(tokenValue: string) {
    localStorage.setItem('token', tokenValue)
    this.decodedToken();
    this.updateUserStore();
  }

  // to get token
  getToken() {
    return localStorage.getItem('token');
  }

  isLoggedIn(): boolean {
    const token = !!localStorage.getItem('token');
    const loggedIn = token;
    this.updateLoggedInStatus(loggedIn);
    return loggedIn;
  }

  decodedToken() {
    const jwtHelper = new JwtHelperService();
    const token = this.getToken();
    console.log(token);
    var result;
    if (token != null) {

      result = jwtHelper.decodeToken(token);
      this.userPayLoad = result;
      // console.log(result);
      // this.userStore.setFullNameForStore(result.Name);
      this.updateUserStore()
      return result;
    }
  }

  private updateUserStore() {
    const token = this.getToken();
    if (token) {
      const decodedToken = new JwtHelperService().decodeToken(token);
      this.userStore.setFullNameForStore(decodedToken.Name);
      this.userStore.setRoleForStore(decodedToken.Role);
      this.userStore.setEmailForStore(decodedToken.Email);
      this.userStore.setUserIdForStore(decodedToken.UserId);

      //console.warn("dcode =", decodedToken.Role);

    }
  }

  getFullNameFromToken() {
    if (this.userPayLoad) {
      // console.log("User -> Name", this.userPayLoad.Name);
      return this.userPayLoad.Name
    }
  }
  getUserIdFromToken() {
    if (this.userPayLoad) {
      // console.log("UserId ->", this.userPayLoad.UserId);
      return this.userPayLoad.UserId
    }
  }
  getRoleFromToken() {
    if (this.userPayLoad) {
      // console.log("Role ->",this.userPayLoad.Role);
      return this.userPayLoad.Role
    }
  }
  getEmailFromToken() {
    if (this.userPayLoad) {
      // console.log("Email ->",this.userPayLoad.Email);
      return this.userPayLoad.Email
    }
  }


}
