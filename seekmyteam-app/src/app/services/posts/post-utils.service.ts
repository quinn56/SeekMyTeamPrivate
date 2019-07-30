import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators/map';
import { Post } from 'src/app/home/home.component';

interface ApplyPayload {
  owner: string,
  applicant: string
}

interface InvitePayload {
  owner: string,
  invite: string,
  project: string
}

interface DeletePayload {
  name: string
}

interface CreatePayload {
  name: string,
  description: string,
  skills: string,
  ownerName: string,
  date: string
}

interface UpdatePayload {
  name: string,
  description: string,
  skills: string,
  members: string,
  comments: string,
  likes: string
}

interface CommentPayload {
  owner: string,
  commentor: string,
  project: string
}

interface LikePayload {
  owner: string,
  liker: string,
  project: string
}


@Injectable({
  providedIn: 'root'
})

export class PostUtilsService {

  constructor(private http: HttpClient) { }

  public fetchPosts(key: any): Observable<any> {
    if (key) {
      return this.getPosts(key.Name.S);
    } else {
      return this.getPosts(null);
    }
  }

  public fetchPost(key: string): Observable<any> {
    return this.getPost(key);
  }

  public fetchUserPosts(email: string): Observable<any> {
    return this.getUserPosts(email);
  }

  public fetchAppliedPosts(email: string): Observable<any> {
    return this.getAppliedPosts(email);
  }

  public apply(owner: string, applicant: string): Observable<any> {
    let payload: ApplyPayload = {
      owner: owner,
      applicant: applicant
    };

    return this.postApply(payload);
  }

  public invite(owner: string, invite: string, project: string): Observable<any> {
    let payload: InvitePayload = {
      owner: owner,
      invite: invite,
      project: project
    };

    return this.postInvite(payload);
  }

  public comment(owner: string, commentor: string, project: string): Observable<any> {
    let payload: CommentPayload = {
      owner: owner,
      commentor: commentor,
      project: project
    };

    return this.postComment(payload);
  }

  public like(owner: string, liker: string, project: string): Observable<any> {
    let payload: LikePayload = {
      owner: owner,
      liker: liker,
      project: project
    };

    return this.postLike(payload);
  }

  public delete(name: string): Observable<any> {
    let payload: DeletePayload = {
      name: name
    };
    return this.postDelete(payload);
  }

  public create(name: string, description: string, skills: string, ownerName: string): Observable<any> {
    let payload: CreatePayload = {
      name: name,
      description: description,
      skills: skills,
      ownerName: ownerName,
      date: Date.now().toString()
    }

    return this.postCreate(payload);
  }

  public update(post: Post): Observable<any> {
    let payload: UpdatePayload = {
      name: post.name,
      description: post.description,
      skills: JSON.stringify(post.skills),
      members: JSON.stringify(post.members),
      comments: JSON.stringify(post.comments),
      likes: JSON.stringify(post.likes)
    };

    return this.postUpdate(payload);
  }

  private postUpdate(req: UpdatePayload): Observable<any> {
    let base = this.http.post('/api/updatePost', req, { headers: { Authorization: `Bearer ${this.getToken()}` } });

    const requestedData = base.pipe(
      map((data) => {
        return data;
      })
    );

    return requestedData;
  }

  public fetchComments(name: string): Observable<any> {
    let base = this.http.get('/api/comments', { headers: { Authorization: `Bearer ${this.getToken()}` }, params: { name: name } });

    const requestedData = base.pipe(
      map((data) => {
        return data;
      })
    );

    return requestedData;
  }

  public fetchLikes(name: string): Observable<any> {
    let base = this.http.get('/api/likes', { headers: { Authorization: `Bearer ${this.getToken()}` }, params: { name: name } });

    const requestedData = base.pipe(
      map((data) => {
        return data;
      })
    );

    return requestedData;
  }

  private postCreate(req: CreatePayload): Observable<any> {
    let base = this.http.post('/api/createPost', req, { headers: { Authorization: `Bearer ${this.getToken()}` } });

    const requestedData = base.pipe(
      map((data) => {
        return data;
      })
    );

    return requestedData;
  }

  private postDelete(req: DeletePayload): Observable<any> {
    let base = this.http.post('/api/deletePost', req, { headers: { Authorization: `Bearer ${this.getToken()}` } });

    const requestedData = base.pipe(
      map((data) => {
        return data;
      })
    );

    return requestedData;
  }

  private postApply(req: ApplyPayload): Observable<any> {
    let base = this.http.post('/api/apply', req, { headers: { Authorization: `Bearer ${this.getToken()}` } });

    const requestedData = base.pipe(
      map((data) => {
        return data;
      })
    );

    return requestedData;
  }

  private postInvite(req: InvitePayload): Observable<any> {
    let base = this.http.post('/api/invite', req, { headers: { Authorization: `Bearer ${this.getToken()}` } });

    const requestedData = base.pipe(
      map((data) => {
        return data;
      })
    );

    return requestedData;
  }

  private postComment(req: CommentPayload): Observable<any> {
    let base = this.http.post('/api/comment', req, { headers: { Authorization: `Bearer ${this.getToken()}` } });

    const requestedData = base.pipe(
      map((data) => {
        return data;
      })
    );

    return requestedData;
  }

  private postLike(req: LikePayload): Observable<any> {
    let base = this.http.post('/api/like', req, { headers: { Authorization: `Bearer ${this.getToken()}` } });

    const requestedData = base.pipe(
      map((data) => {
        return data;
      })
    );

    return requestedData;
  }

  private getPost(key: string): Observable<any> {
    let base = this.http.get('/api/post/' + key, { headers: { Authorization: `Bearer ${this.getToken()}` } });

    const requestedData = base.pipe(
      map((data) => {
        return data;
      })
    );

    return requestedData;
  }
  private getPosts(key: string): Observable<any> {
    let base = this.http.get('/api/posts', { headers: { Authorization: `Bearer ${this.getToken()}` }, params: { ExclusiveStartKey: key } });

    const requestedData = base.pipe(
      map((data) => {
        return data;
      })
    );

    return requestedData;
  }

  private getUserPosts(email: string): Observable<any> {
    let base = this.http.get('/api/userPosts', { headers: { Authorization: `Bearer ${this.getToken()}` }, params: { email: email } });

    const requestedData = base.pipe(
      map((data) => {
        return data;
      })
    );

    return requestedData;
  }

  private getAppliedPosts(email: string): Observable<any> {
    let base = this.http.get('/api/appliedPosts', { headers: { Authorization: `Bearer ${this.getToken()}` }, params: { email: email } });

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
}
