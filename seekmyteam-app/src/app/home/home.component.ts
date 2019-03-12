import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { PostUtilsService } from '../services/posts/post-utils.service';

export interface Post {
    name: string,
    description: string,
    ownerName: string,
    ownerEmail: string
}

@Component({
  templateUrl: './home.component.html'
})
export class HomeComponent {
    posts: Post[];
    private LastEvaluatedKey: any; 
    showMore: boolean;
    showModal: boolean;
    selectedPost: Post = null;

    constructor(
        private router: Router,
        private post_utils: PostUtilsService
    ) {
        this.showMore = true;
        this.showModal = false;
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

    displayPost(item) {
        this.showModal = true;
        this.selectedPost = {
            name: item.Name.S,
            description: item.Description.S,
            ownerName: item.OwnerName.S,
            ownerEmail: item.OwnerEmail.S
        };
    }

    closeModal() {
        this.showModal = false;
    }

    addNewPost() {
        
    }
}