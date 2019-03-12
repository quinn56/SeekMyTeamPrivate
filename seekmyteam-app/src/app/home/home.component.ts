import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { PostUtilsService } from '../services/posts/post-utils.service';

interface Post {
    name: string,
    description: string,
    owner: string
}

@Component({
  templateUrl: './home.component.html'
})
export class HomeComponent {
    posts: Post[];
    private LastEvaluatedKey: any; 
    showMore: boolean;

    constructor(
        private router: Router,
        private post_utils: PostUtilsService
    ) {
        this.showMore = true;
        this.LastEvaluatedKey = null;
    }
    
    ngOnInit() {
        this.post_utils.fetchPosts(this.LastEvaluatedKey).subscribe(data => {
            this.posts = data.posts;
            this.LastEvaluatedKey = data.key; 
            this.checkMorePosts();
        }, (err) => {
            console.error(err);
        });
    }

    fetchMore() {
        this.post_utils.fetchPosts(this.LastEvaluatedKey).subscribe(data => {
            console.log("fetch more" + JSON.stringify(data));
            this.posts = this.posts.concat(data.posts);
            this.LastEvaluatedKey = data.key; 
            this.checkMorePosts();
        }, (err) => {
            console.error(err);
        });
    }

    checkMorePosts() {
        if (!this.LastEvaluatedKey) {
            this.showMore = false;
        } else { 
            this.showMore = true;
        }
    }
}