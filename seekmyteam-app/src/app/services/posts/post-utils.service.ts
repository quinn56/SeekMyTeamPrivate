import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators/map';

@Injectable({
  providedIn: 'root'
})

export class PostUtilsService {

  constructor(private http: HttpClient) { }

  fetchPosts(key: any): Observable<any> {
    if (key) {
      return this.getPosts(key.Name.S);
    } else {
      return this.getPosts(null);
    }
  }

  private getPosts(key: string): Observable<any> {
    console.log(JSON.stringify(key));

    let base = this.http.get('/api/posts', { headers: { Authorization: `Bearer ${this.getToken()}`}, params: {ExclusiveStartKey: key}});
    
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
