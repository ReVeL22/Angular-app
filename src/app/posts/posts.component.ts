import { Component, OnInit } from '@angular/core';
import { UserService } from '../user.service';
import { IUsers } from '../users';
import { IPosts } from '../posts';
import { IComments } from '../comments';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { map } from 'rxjs/operators';

@Component({
  selector: 'app-posts',
  templateUrl: './posts.component.html',
  styleUrls: ['./posts.component.scss']
})
export class PostsComponent implements OnInit {

  users: IUsers[];
  posts: IPosts[];
  comments: IComments[];
  addPost: FormGroup;
  addComment: FormGroup;


  constructor(private toastr: ToastrService, private userService: UserService, public formBuilder: FormBuilder) { }

  ngOnInit() {
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
        () => { }
      );
    
    this.userService.getComments()
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
        data => this.comments = data,
        (error) => console.log(error),
        () => { }
      );

      this.addPost = new FormGroup({
        'body': new FormControl(null, Validators.required),
        'date': new FormControl(null, Validators.required),
        'title': new FormControl(null, Validators.required),
        'user_id': new FormControl(null, Validators.required)
      });

      this.addComment = new FormGroup({
        'body': new FormControl(null, Validators.required),
        'date': new FormControl(null, Validators.required),
        'name': new FormControl(null, Validators.required),
        'email': new FormControl(null, Validators.required),
        'post_id': new FormControl(null, Validators.required)
      });
  }

  newPostBtnActive = false;

  newPostBtn() {
    this.newPostBtnActive = !this.newPostBtnActive;
  }

  getDate() {
    let date = new Date();
    let d = date.getFullYear() + '.' + date.getMonth() + '.' + date.getDate();
    let hours = date.getHours();
    let minutes = date.getMinutes();
    let seconds = date.getSeconds();
    let hours2: any;
    let minutes2: any;
    let seconds2: any;
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

    if(seconds < 10){
      if(seconds == 0) { 
        seconds2 = "00"
      }
      else {
      seconds2 = '0' + seconds;
      }
    }
    else {
      seconds2 = seconds;
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
    date2 = d + ' ' + hours2 + ":" + minutes2 + ":" + seconds2;
    return date2;
  }

  onSubmitPost() {
    let date2 = this.getDate();
    
    this.addPost.controls['date'].setValue(date2);

    this.userService.postPost(this.addPost.value)
      .subscribe(
        () => {
          this.toastr.success('Post Added!');
          setTimeout(() => window.location.reload(), 1000);
        }
      );
  }

  onSubmitComment(id) {
    let date2 = this.getDate();
    
    this.addComment.controls['date'].setValue(date2);
    this.addComment.controls['post_id'].setValue(id);

    this.userService.postComment(this.addComment.value)
      .subscribe(
        () => {
          this.toastr.success('Comment Added!');
          setTimeout(() => window.location.reload(), 1000);
        }
      );
  }

}
