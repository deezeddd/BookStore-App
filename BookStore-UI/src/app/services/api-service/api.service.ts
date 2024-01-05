import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, Subject, tap } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ApiService {

  private baseUrl: String = "https://localhost:7275/api/";
  constructor(private http: HttpClient) { }

  //for real-time updates
  private _refreshNeeded$ = new Subject<void>();
  private _refreshNeededAllBooks$ = new Subject<void>();


  get refreshNeeded$() {
    return this._refreshNeeded$;
  }


  getAllBooks(): Observable<any> {
    return this.http.get<any>(`${this.baseUrl}GetAllBooks`)
  }
  addBook(bookObj: any): Observable<any> {
    return this.http.post<any>(`${this.baseUrl}AddBook`, bookObj)
  }
  editBook(id: any, bookObj: any): Observable<any> {
    return this.http.put<any>(`${this.baseUrl}EditBook/${id}`, bookObj)
  }
  deleteBook(id: any): Observable<any> {
    return this.http.delete<any>(`${this.baseUrl}DeleteBook/${id}`)
  }
  getBookById(id: any): Observable<any> {
    return this.http.get<any>(`${this.baseUrl}GetBookById/${id}`)
  }
  getUserToken(id: Observable<string>): Observable<any> {
    return this.http.get<any>(`${this.baseUrl}GetUserToken?userId=${id}`).pipe(
      tap(() => {
        this._refreshNeeded$.next();
      })
    )
  }
  getMyBooks(userId: any): Observable<any> {
    console.log("hekko");
    return this.http.get<any>(`${this.baseUrl}MyBooks?userId=${userId}`)
  }
  getBorrowedBooks(userId: any): Observable<any> {
    console.log();
    return this.http.get<any>(`${this.baseUrl}BorrowedBooks?userId=${userId}`)
  }

  borrowBook(bookId: number, userId: string): Observable<any> {
    return this.http.post<any>(`${this.baseUrl}BorrowBook?id=${bookId}&borrowUserId=${userId}`, "");
  }

  


}
