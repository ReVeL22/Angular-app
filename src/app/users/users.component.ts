import { Component, OnInit } from '@angular/core';
import { UserService } from '../user.service';
import { IUsers } from '../users';
import { IPosts } from '../posts';
import { FormGroup, FormBuilder, Validators, FormControl, Form } from '@angular/forms';
import { map } from 'rxjs/operators';
import { ToastrService } from 'ngx-toastr';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.scss']
})

export class UsersComponent implements OnInit {

  users: IUsers[];
  users$: Observable<IUsers[]>;
  a: IUsers[];
  posts: IPosts[];
  addUser: FormGroup;
  putUser: FormGroup;
  addPost: FormGroup;
  fb: any;

  constructor(private toastr: ToastrService, private userService: UserService, public formBuilder: FormBuilder) { }

  ngOnInit() {
    this.users$ = this.userService.getUsers();
    this.users$.pipe(map(responseData => {
      const postsArray = [];
      for (const key in responseData) {
        if (responseData.hasOwnProperty(key)) {
        postsArray.push({ ...responseData[key], id: key });
      }
      }
      return postsArray;
    })).subscribe(e => this.a = e);

    this.userService.getUsers()
      .pipe(map(responseData => {
        const postsArray = [];
        for (const key in responseData) {
          if (responseData.hasOwnProperty(key)) {
          postsArray.push({ ...responseData[key], id: key });
        }
        }
        return postsArray;
      }))
      .subscribe(
        data => this.users = data,
        (error) => console.log(error),
        () => { }
      );
    
    this.userService.getPosts()
      .pipe(map(responseData => {
        const postsArray = [];
        for (const key in responseData) {
          if (responseData.hasOwnProperty(key)) {
          postsArray.push({ ...responseData[key], id: key });
        }
        }
        return postsArray;
      }))
      .subscribe(
        data => this.posts = data,
        (error) => console.log(error),
        () => {}
      );

      this.addUser = new FormGroup({
        'first_name': new FormControl(null, Validators.required),
        'last_name': new FormControl(null, Validators.required),
        'email': new FormControl(null, Validators.required),
        'phone': new FormControl(null, Validators.required),
        'address': new FormGroup({
          'city': new FormControl(null, Validators.required),
          'country': new FormControl(null, Validators.required),
          'postal_code': new FormControl(null, Validators.required),
          'street': new FormControl(null, Validators.required)
        })
        });

      this.putUser = new FormGroup({
        'first_name': new FormControl(null, Validators.required),
        'last_name': new FormControl(null, Validators.required),
        'email': new FormControl(null, Validators.required),
        'phone': new FormControl(null, Validators.required),
        'address': new FormGroup({
          'city': new FormControl(null, Validators.required),
          'country': new FormControl(null, Validators.required),
          'postal_code': new FormControl(null, Validators.required),
          'street': new FormControl(null, Validators.required)
        })
        });

        this.addPost = new FormGroup({
          'body': new FormControl(null, Validators.required),
          'date': new FormControl(null, Validators.required),
          'title': new FormControl(null, Validators.required),
          'user_id': new FormControl(null, Validators.required)
        });
    }


  isChosen = 0;
  whichButton: number;
  newPostBtnActive = false;
  newUserActive = false;
  showPostsBtnActive = false;
//Metoda przycisków view, edit, delete
  klik(nr, btn) {
    if (nr == this.isChosen && this.whichButton == btn)
      nr = 0;
    this.isChosen = nr;
    this.whichButton = btn;
  }
//Metoda przycisku do tworzenia nowego postu danego użytkownika
  newPostBtn() {
    this.newPostBtnActive = !this.newPostBtnActive;
    this.showPostsBtnActive = false;
  }
//Metoda przycisku do tworzenia nowego użytkownika
  newUserBtn() {
    this.newUserActive = !this.newUserActive;
  }
//Metoda przycisku do pokazywania postów użytkownika
  showPostsBtn() {
    this.showPostsBtnActive = !this.showPostsBtnActive;
    this.newPostBtnActive = false;
  }
//Metoda wykonywana przy usuwaniu użytkownika
  userDelete(i) {
    this.userService.deleteUser(i)
      .subscribe(
        () => {
          this.toastr.success("User successfully deleted!");
          setTimeout(() => window.location.reload(), 1000); }
      );

  }
//Metoda wykonywana przy dodawaniu nowego użytkownika
  onSubmit() {
    this.userService.postUser(this.addUser.value)
      .subscribe(
        () => {
          this.newUserActive = false;
          this.toastr.success('User added to database!');
          setTimeout(() => window.location.reload(), 1000); 
        }
      );
  }
//Metoda wykonywana przy zmianie danych użytkownika
  onSubmitPut(id) {
    this.userService.putUser(id, this.putUser.value)
      .subscribe(
        () => {
          this.toastr.success('User data updated!');
          setTimeout(() => window.location.reload(), 1000); 
        }
      );
      
  }
//Metoda wykonywana przy tworzeniu postu
  onSubmitPost(id) {
    let date = new Date();
    let hours = date.getHours();
    let minutes = date.getMinutes();
    let hours2: any;
    let minutes2: any;
    let date2: any;

    if(hours < 10){
      if(hours == 0) { 
        hours2 = "00"
      }
      else {
      hours2 = '0' + hours;
      }
    }
    else {
      hours2 = hours;
    }

    if(minutes < 10){
      if(minutes == 0) { 
        minutes2 = "00"
      }
      else {
      minutes2 = '0' + minutes;
      }
    }
    else {
      minutes2 = minutes;
    }
    date2 = hours2 + ":" + minutes2 + ":" + date.getSeconds();
    
    this.addPost.controls['date'].setValue(date2);
    this.addPost.controls['user_id'].setValue(id);

    this.userService.postPost(this.addPost.value)
      .subscribe(
        () => {
          this.toastr.success('Post Added!');
          setTimeout(() => window.location.reload(), 1000); 
        }
      );
      
  }

}
