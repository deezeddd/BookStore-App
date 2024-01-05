import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NgToastService } from 'ng-angular-popup';
import { combineLatest } from 'rxjs';
import { ApiService } from 'src/app/services/api-service/api.service';
import { AuthService } from 'src/app/services/auth-service/auth.service';
import { UserStoreService } from 'src/app/services/user-store-service/user-store.service';

@Component({
  selector: 'app-book-details',
  templateUrl: './book-details.component.html',
  styleUrls: ['./book-details.component.css']
})
export class BookDetailsComponent implements OnInit {
  id: number = 0;
  book: any;

  constructor(
    private apiService: ApiService,
    private router: ActivatedRoute,
    private route: Router, private userStore: UserStoreService, private authService: AuthService, private toast: NgToastService) { }

  isLoggedIn: boolean = false;

  ngOnInit() {
    this.isLoggedIn = this.authService.isLoggedIn();
    this.userDetails();
    this.router.paramMap.subscribe(params => {
      this.id = +params.get('id')!;
      if (this.id != null) {
        this.getBookById();
      }
    })
    this.apiService.refreshNeeded$.subscribe(() => {
      this.getBookById()
    })
  }

  getBookById() {
    this.apiService.getBookById(this.id).subscribe(res => {
      this.book = (res);
    })
  }

  userId: string = "";
  userDetails() {
    combineLatest([
      this.userStore.getUserIdFromStore()
    ]).subscribe(([userIdFromStore]) => {
      const userIdFromToken = this.authService.getUserIdFromToken();
      this.userId = userIdFromStore || userIdFromToken;
    });
  }

  borrowBook() {
    if (this.isLoggedIn == true) {

      if (this.id != null && this.userId != null)
        this.apiService.borrowBook(this.id, this.userId).subscribe(res => {
          this.route.navigate(['']).then(() => {
            this.toast.success({ detail: "Successful", summary: "Book Borrowed Successfully", duration: 1000 });
            setTimeout(() => {
              window.location.reload();
            }, 1000);
          });
        }, err => (
          this.toast.error({ detail: "Unsuccessful", summary: "Book Borrow Unsuccessful", duration: 3000 })
        )
        );
    }
    else {
      this.toast.error({ detail: "Unsuccessful", summary: "Please Login First", duration: 3000 })
      this.route.navigate(['login'])
    }
  }



}
