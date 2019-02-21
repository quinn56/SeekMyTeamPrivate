import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators/map';

export interface UserDetails {
  email: string,
  exp: number,
  iat: number
}

export interface UserProfile {
  email: string,
  name: string,
  description: string
}

@Injectable({
  providedIn: 'root'
})
export class UserUtilsService {

  constructor(private http: HttpClient) { }

  public getProfile(email: string): Observable<any> {
    return this.requestProfile(email);
  }

  private requestProfile(email: string): Observable<any> {
    let base = this.http.get('/api/profile/' + email, { headers: { Authorization: `Bearer ${this.getToken()}`}});

    const requestedData = base.pipe(
      map((data) => {
        return data;
      })
    );

    return requestedData;
  }

  private getToken(): string {
    return localStorage.getItem('jwt-token');
  }

  public getUserDetails(): UserDetails {
    const token = this.getToken();
    let payload;

    if (token) {
      payload = token.split('.')[1];
      payload = window.atob(payload);
      return JSON.parse(payload);
    } else {
      return null;
    }
  }
}
