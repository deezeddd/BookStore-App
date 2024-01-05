import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UserStoreService {

  private fullName$ = new BehaviorSubject<string>("");
  private userId$ = new BehaviorSubject<string>("");
  private role$ = new BehaviorSubject<string>("");
  private email$ = new BehaviorSubject<string>("");

  constructor() { }

  public getRoleFromStore() {
    return this.role$.asObservable();
  }

  public setRoleForStore(role: string) {
    this.role$.next(role);
  }

  public setFullNameForStore(fullname: string): void {
    this.fullName$.next(fullname);
  }

  public getFullNameFromStore(): Observable<string> {
    // console.log("Service ", this.fullName$.asObservable());
    return this.fullName$.asObservable();
  }

  public setUserIdForStore(userId: string): void {

    this.userId$.next(userId);
  }

  public getUserIdFromStore(): Observable<string> {
    console.log("userId userStore-> ",this.userId$.asObservable());
    return this.userId$.asObservable();
  }

  public setEmailForStore(email: string): void {
    this.email$.next(email);
  }

  public getEmailFromStore(): Observable<string> {
    console.log(this.email$.asObservable());
    return this.email$.asObservable();
  }

}
