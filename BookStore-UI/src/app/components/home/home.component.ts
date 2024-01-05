import { HttpClient } from '@angular/common/http';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NgToastService } from 'ng-angular-popup';
import { combineLatest, debounceTime } from 'rxjs';
import { ApiService } from 'src/app/services/api-service/api.service';
import { AuthService } from 'src/app/services/auth-service/auth.service';
import { UserStoreService } from 'src/app/services/user-store-service/user-store.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  constructor(private http: HttpClient, private toast: NgToastService,
    private apiService: ApiService, private authService: AuthService,
    private userStore: UserStoreService,
    private route: Router) { }
  ngOnInit(): void {
    this.getBooksList();
    this.search ='';
    this.userDetails();
  }


  originalBooks: any = [];
  searchArray: any = [];
  books: any = []
  getBooksList() {
    this.apiService.getAllBooks().subscribe((data: any) => {
      this.books = data.filter((book:any) => book.lentByUserId != this.userId); //stores permanent list
      this.originalBooks = data.filter((book:any) => book.lentByUserId != this.userId);; // for search purpose
      console.log(this.originalBooks);
    });
  }

  onClick(id: any) {
    this.route.navigate(["book-details", id])
  }

  onDelete(id: any) {
    this.apiService.deleteBook(id).subscribe((res) => {
      console.log("Deleted");
    })
  }
  isLoggedIn: any
  Name: string = "";
  Role: any;
  userId: string = "";
  search: string = "";
  searchText: string = "";
  // isAdmin = false;

  userDetails() {
    combineLatest([                 //Rxjs property
      this.userStore.getFullNameFromStore(),
      this.userStore.getRoleFromStore(),
      this.userStore.getUserIdFromStore()

    ]).subscribe(([fullNameFromStore, roleFromStore, userIdFromStore]) => {
      const fullNameFromToken = this.authService.getFullNameFromToken();
      const roleFromToken = this.authService.getRoleFromToken();
      const userIdFromToken = this.authService.getUserIdFromToken();
      this.userId = userIdFromStore || userIdFromToken;
      this.Name = fullNameFromStore || fullNameFromToken;
      this.Role = roleFromStore || roleFromToken;
    });
  }

  public genre: any = null;
  public author: any = null;
  public cost: any = null;
  public filter: any = null;


  onSearch() {
    this.originalBooks = this.books
    this.searchText = this.search;
    if (this.search.trim() === '') {
      this.searchArray = this.originalBooks;
    } else {
      const searchTerm = this.search.toLowerCase();
      this.searchArray = this.originalBooks.filter(
        (book : any) =>
         ( book.name.toLowerCase().includes(searchTerm) ||
          book.author.toLowerCase().includes(searchTerm) ||
          book.genre.toLowerCase().includes(searchTerm) )&& !book.lentByUserId.includes(this.userId) && book.isAvailable === true
          );
          this.originalBooks = this.searchArray;
    }

  }

}
