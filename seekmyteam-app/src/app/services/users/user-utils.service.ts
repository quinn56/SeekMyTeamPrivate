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
  description: string,
  skills: string[]
}

interface DeletePayload {
  email: string
}

interface UpdatePayload {
  description: string,
  skills: string
}

interface PicturePayload {
  image: string
}

@Injectable({
  providedIn: 'root'
})
export class UserUtilsService {

  constructor(private http: HttpClient) { }

  public updateProfile(description: string, skills: string): Observable<any> {
    var req: UpdatePayload = {
        description: description,
        skills: skills
    };
    return this.requestUpdateProfile(req);
  }

  public getProfile(email: string): Observable<any> {
    return this.requestProfile(email);
  }

  public getProfilePic(email: string): Observable<any> {
    return this.requestProfilePic(email);
  }

  public deleteProfile(email: string): Observable<any> {
    var req: DeletePayload = {
      email: email
    }
    return this.requestDeleteProfile(req);
  }

  public uploadProfilePicture(data: string): Observable<any> {
    var req: PicturePayload = {
      image: data
    }
    return this.postPicture(req);
  }

  private postPicture(req: PicturePayload) {
    let base = this.http.post('/api/profile/uploadPicture', req, { headers: { Authorization: `Bearer ${this.getToken()}`}});

    const requestedData = base.pipe(
      map((data) => {
        return data;
      })
    );

    return requestedData;
  }

  private requestProfilePic(email: string): Observable<any> {
    let base = this.http.get('/api/profile/' + email + '/pic', { headers: { Authorization: `Bearer ${this.getToken()}`}});
    const requestedData = base.pipe(
      map((data) => {
        return data;
      })
    );

    return requestedData;
  }

  private requestUpdateProfile(req: UpdatePayload): Observable<any> {
    let base = this.http.post('/api/profile/update', req, { headers: { Authorization: `Bearer ${this.getToken()}`}});

    const requestedData = base.pipe(
      map((data) => {
        return data;
      })
    );

    return requestedData;
  }

  private requestDeleteProfile(req: DeletePayload): Observable<any> {
    let base = this.http.post('/api/profile/delete', req, { headers: { Authorization: `Bearer ${this.getToken()}`}});

    const requestedData = base.pipe(
      map((data) => {
        return data;
      })
    );

    return requestedData;
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

  public getCurrentUserDetails(): UserDetails {
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
