import { Injectable, Output, EventEmitter } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators/map';
import { Router } from '@angular/router';

interface TokenResponse {
  token: string;
}

export interface LoginPayload {
  email: string;
  password: string;
}

export interface RegisterPayload {
  email: string;
  password: string;
  name: string;
}

export interface ConfirmPayload {
  email: string;
  code: string;
}

@Injectable({
  providedIn: 'root'
})
export class AuthenticationService {
  private token: string;

  constructor(private http: HttpClient, private router: Router) { }

  private saveToken(token: string): void {
    localStorage.setItem('jwt-token', token);
    this.token = token;
  }

  public logout(): void {
    this.token = '';
    window.localStorage.removeItem('jwt-token');
    this.router.navigateByUrl('/login');
  }

  private requestLogin(user: LoginPayload): Observable<any> {
    let base = this.http.post('/api/login', user);

    const requestedData = base.pipe(
      map((data: TokenResponse) => {
        if (data.token) {
          this.saveToken(data.token);
        }
        return data;
      })
    );

    return requestedData;
  }

  private requestRegistration(user: RegisterPayload): Observable<any> {
    let base = this.http.post('/api/register',  user);

    const requestedData = base.pipe(
      map((data: any) => {
        return data;
      })
    );

    return requestedData;
  }

  private requestConfirmation(user: ConfirmPayload): Observable<any> {
    let base = this.http.post('/api/register/confirm', user);

    const requestedData = base.pipe(
      map((data: TokenResponse) => {
        if (data.token) {
          this.saveToken(data.token);
        }
        return data;
      })
    );

    return requestedData;
  }

  public login(user: LoginPayload): Observable<any> { 
    return this.requestLogin(user);
  }

  
  public register(user: RegisterPayload): Observable<any> { 
    return this.requestRegistration(user);
  }
  
  public confirm(user: ConfirmPayload): Observable<any> { 
    return this.requestConfirmation(user);
  }

}

