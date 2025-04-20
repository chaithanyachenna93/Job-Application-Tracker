import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  getUser() {
    throw new Error('Method not implemented.');
  }

  private API_URL = 'http://localhost:3000/api';

  constructor(private http: HttpClient) {}

  login(phoneNumber: string, password: string): Observable<any> {
    return this.http.post(`${this.API_URL}/login`, {
      phoneNumber,
      password,
    });
  }
}


