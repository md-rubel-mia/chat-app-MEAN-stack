import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { BehaviorSubject, ReplaySubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class LoginService {
  private currentUser = new ReplaySubject(1);
  currentUserData = this.currentUser.asObservable();
  baseUrl = "http://localhost:5000/";
  header: any = new HttpHeaders({
    "Content-Type": "application/json"
  });
  
  constructor(private http: HttpClient) { }

  loginUser(user) {
    return this.http.post(`${this.baseUrl}login`, user, {headers: this.header, withCredentials: true, observe: "response"});
  }

  setCuurentUser(user) {
    this.currentUser.next(user);
  }

}
