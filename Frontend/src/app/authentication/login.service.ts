import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
@Injectable({
  providedIn: 'root'
})

export class LoginService {
  private apiUrl = '/api/users';
  constructor(private http: HttpClient) { }
  
  register(username: string, password: string, email:string): Observable<any> {
    return this.http.post(`${this.apiUrl}/register`, { username, password, email });
  }

  login(identifier: string, password: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/login`, { identifier, password });
  }
}
