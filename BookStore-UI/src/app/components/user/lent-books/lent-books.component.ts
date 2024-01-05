import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NgToastService } from 'ng-angular-popup';
import { combineLatest } from 'rxjs';
import { ApiService } from 'src/app/services/api-service/api.service';
import { AuthService } from 'src/app/services/auth-service/auth.service';
import { UserStoreService } from 'src/app/services/user-store-service/user-store.service';


@Component({
  selector: 'app-lent-books',
  templateUrl: './lent-books.component.html',
  styleUrls: ['./lent-books.component.css']
})
export class LentBooksComponent implements OnInit {

  Name: string = "";
  Email: string = "";

  constructor(private route: Router, private authService: AuthService,
    private toast: NgToastService, private userStore: UserStoreService, private apiService: ApiService
  ) { }
  ngOnInit() {
  this.getMyBooksList();
  this.userDetails();
  }
  userId: any;


  originalBooks: any = [];

  getMyBooksList() {
    if(this.userId!=null){
      this.apiService.getMyBooks(this.userId).subscribe((data: any) => {
        this.originalBooks = data;
      });
    }
  }
  onClick(id: any) {
    this.route.navigate(["book-details", id])
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
      this.getMyBooksList();
    });
  }

}
