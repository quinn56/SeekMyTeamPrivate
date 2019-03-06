import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators/map';

@Injectable({
  providedIn: 'root'
})

export class PostUtilsService {

  constructor(private http: HttpClient) { }

  fetchPosts(key: string): Observable<any> {
    return this.getPosts(key);
  }

  private getPosts(key: string): Observable<any> {
    let base = this.http.get('/api/posts', { headers: { Authorization: `Bearer ${this.getToken()}`}});

    const requestedData = base.pipe(
      map((data) => {
        return data;
      })
    );

    return requestedData;
  }

  filterPosts() {

  }

  private getToken(): string {
    return localStorage.getItem('jwt-token');
  }
}
