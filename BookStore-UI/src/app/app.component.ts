import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import 'bootstrap'
import { NgToastService } from 'ng-angular-popup';
import { BehaviorSubject, combineLatest } from 'rxjs';
import { ApiService } from './services/api-service/api.service';
import { AuthService } from './services/auth-service/auth.service';
import { UserStoreService } from './services/user-store-service/user-store.service';
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  title = 'Book-Store_UI';

  isLoggedIn: any
  Name: any;
  userId: any;
  Email: string = "";
  Token: number = 0;
  isAdmin = false;
  constructor(private route: Router, private authService: AuthService,
    private toast: NgToastService, private userStore: UserStoreService, private apiService: ApiService
  ) { }

  ngOnInit(): void {
    // var a = localStorage.getItem('token')
    // console.log("init -> ", a);
    this.isLoggedIn = this.authService.isLoggedIn();
    this.userDetails();

    // console.log("on login", this.userId)

    this.authService.loggedIn$.subscribe((loggedIn: boolean) => {
      // console.log("navbar LoggedinStatus:-> ", loggedIn)
      this.isLoggedIn = loggedIn;
    });

    // this.apiService.refreshNeeded$.subscribe(() => {
    //   this.getUserToken();
    // })
    this.getUserToken();
  }

  getUserToken() {
    if(this.userId!=null){
      this.apiService.getUserToken(this.userId).subscribe(res => {
        this.Token= res;
        console.log(res);
      })
    }
  }

  userDetails() {
    combineLatest([
      this.userStore.getFullNameFromStore(),
      this.userStore.getUserIdFromStore(),
      this.userStore.getEmailFromStore()

    ]).subscribe(([fullNameFromStore, userIdFromStore, emailFromStore]) => {
      const fullNameFromToken = this.authService.getFullNameFromToken();
      const userIdFromToken = this.authService.getUserIdFromToken();
      // console.log("fg", userIdFromToken);
      const emailFromToken = this.authService.getEmailFromToken();

      this.Name = fullNameFromStore || fullNameFromToken;
      this.userId = userIdFromStore || userIdFromToken;
      this.Email = emailFromStore || emailFromToken;
      this.getUserToken();
    });
  }

  signOut() {
    this.Name = "";
    this.isAdmin = false;
    this.userId = "";
    this.authService.signOut();
    this.toast.success({ detail: 'Success', summary: "Sign Out Successful", duration: 3000, });
    this.route.navigate(['login'])
  }

}
