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
    private LastEvaluatedKey: string; 
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
        }, (err) => {
            console.error(err);
        });

        this.checkMorePosts();
    }

    fetchMore() {
        this.post_utils.fetchPosts(this.LastEvaluatedKey).subscribe(data => {
            this.posts.concat(data.posts);
            this.LastEvaluatedKey = data.key; 
        }, (err) => {
            console.error(err);
        });

        this.checkMorePosts();
    }

    checkMorePosts() {
        if (!this.LastEvaluatedKey) {
            this.showMore = false;
        } else { 
            this.showMore = true;
        }
    }
}