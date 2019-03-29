import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators/map';

interface ApplyPayload {
  owner: string,
  applicant: string
}

interface DeletePayload {
  name: string
}

interface CreatePayload {
  name: string, 
  description: string,
  skills: string,
  ownerName: string
}

interface UpdatePayload {
  name: string,
  description: string,
  skills: string
}


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

  apply(owner: string, applicant: string): Observable<any> {
    let payload: ApplyPayload = {
      owner: owner,
      applicant: applicant
    };
    
    return this.postApply(payload);
  }

  delete(name: string): Observable<any> {
    let payload: DeletePayload = {
      name: name
    };
    return this.postDelete(payload);
  }

  create(name: string, description: string, skills: string, ownerName: string): Observable<any> {
    let payload: CreatePayload = {
      name: name,
      description: description,
      skills: skills,
      ownerName: ownerName
    }

    return this.postCreate(payload);
  }

  update(name: string, description: string, skills: string): Observable<any> {
    let payload: UpdatePayload = {
      name: name,
      description: description,
      skills: skills
    };
    
    return this.postUpdate(payload);
  }

  private postUpdate(req: UpdatePayload): Observable<any> {
    let base = this.http.post('/api/updatePost', req, { headers: {Authorization: `Bearer ${this.getToken()}`}});

    const requestedData = base.pipe(
      map((data) => {
        return data;
      })
    );

    return requestedData;
  }

  private postCreate(req: CreatePayload): Observable<any> {
    let base = this.http.post('/api/createPost', req, { headers: {Authorization: `Bearer ${this.getToken()}`}});

    const requestedData = base.pipe(
      map((data) => {
        return data;
      })
    );

    return requestedData;
  }

  private postDelete(req: DeletePayload): Observable<any> {
    let base = this.http.post('/api/deletePost', req, { headers: {Authorization: `Bearer ${this.getToken()}`}});

    const requestedData = base.pipe(
      map((data) => {
        return data;
      })
    );

    return requestedData;
  }

  private postApply(req: ApplyPayload): Observable<any> {
    let base = this.http.post('/api/apply', req, { headers: { Authorization: `Bearer ${this.getToken()}`}});

    const requestedData = base.pipe(
      map((data) => {
        return data;
      })
    );

    return requestedData;
  }

  private getPosts(key: string): Observable<any> {
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
