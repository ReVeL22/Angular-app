import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { IUsers } from './users';
import { IComments } from './comments';
import { IPosts } from './posts';
import { FormGroup } from '@angular/forms';

const httpOptions = {
  headers: new HttpHeaders({
    'Content-Type': 'application/json'
  }),
};

@Injectable({
  providedIn: 'root'
})
export class UserService {

  private userUrl = 'https://treative-92ece.firebaseio.com/users.json';
  private postUrl = 'https://treative-92ece.firebaseio.com/posts.json';
  private commentUrl = 'https://treative-92ece.firebaseio.com/comments.json';
  private deleteUserUrl = 'https://treative-92ece.firebaseio.com/users';

  constructor(private http: HttpClient) { }

  getUsers(): Observable<IUsers[]> {
    return this.http.get<IUsers[]>(this.userUrl);
  }

  deleteUser(id: number): Observable<{}> {
    return this.http.delete(`${this.deleteUserUrl}/${id}.json`);
  }

  putUser(id: number, data: FormGroup): Observable<FormGroup> {
    return this.http.put<FormGroup>(`${this.deleteUserUrl}/${id}.json`, data, httpOptions);
  }

  getPosts(): Observable<IPosts[]> {
    return this.http.get<IPosts[]>(this.postUrl);
  }

  getComments(): Observable<IComments[]> {
    return this.http.get<IComments[]>(this.commentUrl);
  }

  postUser(data: FormGroup): Observable<FormGroup> {
    return this.http.post<FormGroup>(this.userUrl, data, httpOptions);
  }

  postPost(data: FormGroup): Observable<FormGroup> {
    return this.http.post<FormGroup>(this.postUrl, data, httpOptions);
  }

  postComment(data: FormGroup): Observable<FormGroup> {
    return this.http.post<FormGroup>(this.commentUrl, data, httpOptions);
  }
}
