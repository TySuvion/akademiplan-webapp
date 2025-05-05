import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ApiService {
  private baseUrl = 'http://localhost:3000';
  constructor(private http: HttpClient) {}

  signUp(username: string, password: string) {
    return this.http
      .post(
        `${this.baseUrl}/users}`,
        { username: username, password: password },
        { observe: 'response' }
      )
      .subscribe((response) => {
        console.log('Response Status: ', response.status);
        console.log('Response Body: ', response.body);
      });
  }
}
