import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HomeComponent } from './components/home/home.component';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './components/login/login.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TokenInterceptor } from './Interceptors/token.interceptor';
import { NgToastModule } from 'ng-angular-popup';

import { authGuard } from './guard/auth.guard';
// import { RoleGuard } from './guard/role.guard';
// import { LoggedInGuard } from './guard/logged-in.guard';
import { AddBookComponent } from './components/user/add-book/add-book.component';
import { BookDetailsComponent } from './components/book-details/book-details.component'
import { MyBooksComponent } from './components/user/my-books/my-books.component';
import { BorrowedBooksComponent } from './components/user/borrowed-books/borrowed-books.component';
import { LentBooksComponent } from './components/user/lent-books/lent-books.component';
import { LoggedInGuard } from './guard/logged-in.guard';


const appRoutes: Routes = [
  {
    path: '',
    component: HomeComponent,

  },
  {
    path: 'login',
    component: LoginComponent,
    canActivate: [LoggedInGuard]

  },
  {
    path: 'add-book',
    component: AddBookComponent,
    canActivate: [authGuard]

  },
  {
    path: 'book-details/:id',
    component: BookDetailsComponent,
  },

  {
    path: 'my-books',
    component: MyBooksComponent,
    canActivate: [authGuard]
  },
  {
    path: 'lent-books',
    component: LentBooksComponent,
    canActivate: [authGuard]

  },
  {
    path: 'borrowed-books',
    component: BorrowedBooksComponent,
    canActivate: [authGuard]
  },
]

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    LoginComponent,
    AddBookComponent,
    BookDetailsComponent,
    MyBooksComponent,
    BorrowedBooksComponent,
    LentBooksComponent
  
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    ReactiveFormsModule,
    FormsModule,
    HttpClientModule,
    NgToastModule,
    RouterModule.forRoot(appRoutes)
  ],

  providers: [{
    provide: HTTP_INTERCEPTORS,
    useClass: TokenInterceptor,
    multi: true
  }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
