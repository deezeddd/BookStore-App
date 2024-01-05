import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { NgToastService } from 'ng-angular-popup';
import { combineLatest } from 'rxjs';
import { ApiService } from 'src/app/services/api-service/api.service';
import { AuthService } from 'src/app/services/auth-service/auth.service';
import { UserStoreService } from 'src/app/services/user-store-service/user-store.service';
import { HomeComponent } from '../../home/home.component';

@Component({
  selector: 'app-add-book',
  templateUrl: './add-book.component.html',
  styleUrls: ['./add-book.component.css']
})
export class AddBookComponent implements OnInit {
  Name: any;


  constructor(private apiService: ApiService, private toast: NgToastService, private route: Router,
    private userStore: UserStoreService, private authService: AuthService) { }

  userId: any;
  ngOnInit(): void {
    this.userDetails();
    this.addBookForm.get('lentByUserId')?.setValue(this.userId);
    this.addBookForm.get('lenterName')?.setValue(this.Name);

  }

  addBookForm = new FormGroup({
    name: new FormControl('', [
      Validators.required,
      Validators.maxLength(100),
      Validators.pattern('^[a-zA-Z0-9 ]+$')
    ]),
    author: new FormControl('', [
      Validators.required,
      Validators.maxLength(100),
      Validators.pattern('^[a-zA-Z0-9 ]+$')
    ]),
    genre: new FormControl('', [
      Validators.required,
      Validators.maxLength(100),
      // Validators.pattern('^[a-zA-Z0-9 ]+$')

    ]),
    description: new FormControl('', [
      Validators.required,
      Validators.maxLength(100),
      // Validators.pattern('^[a-zA-Z0-9 ]+$')

    ]),
    ratings: new FormControl('', [
      Validators.required,
      Validators.min(1),
      Validators.max(5),

    ]),
    isAvailable: new FormControl(true, []),
    lentByUserId: new FormControl(),
    lenterName: new FormControl(),
    currentlyBorrowedByUserId: new FormControl(""),


  })

  isSubmitted = false;
  onSubmit() {
    const formData = (this.addBookForm);
    console.log(formData);
    this.isSubmitted = true;

    if (this.addBookForm.valid) {
      this.apiService.addBook(formData.value).subscribe((res) => {
        console.log("AddBook->", res);
        alert("Book Added Successfully")
        this.toast.success({ detail: "Successful", summary: "Book Added Successfully", duration: 3000 })
        this.route.navigate([''])
      }, err => (
        this.toast.error({ detail: "Unsuccessful", summary: "Please add correct details", duration: 3000 })
      )
      );

    } else {
      alert('Form validation failed');
    }
  }

  userDetails() {
    combineLatest([
      this.userStore.getUserIdFromStore(),
      this.userStore.getFullNameFromStore(),

    ]).subscribe(([userIdFromStore, fullNameFromStore]) => {
      const userIdFromToken = this.authService.getUserIdFromToken();
      const fullNameFromToken = this.authService.getFullNameFromToken();
      this.Name = fullNameFromStore || fullNameFromToken;
      this.userId = userIdFromStore || userIdFromToken;
      // console.log(String(this.userId));
    });
  }

}
