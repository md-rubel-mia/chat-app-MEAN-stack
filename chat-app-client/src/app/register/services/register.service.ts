import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class RegisterService {
  baseUrl = "http://localhost:5000/";

  constructor(private http: HttpClient) { }

  registerUser(user) {
    return this.http.post(`${this.baseUrl}signup`, user);
  }
}
