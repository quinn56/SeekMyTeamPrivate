import { Component } from '@angular/core';
import { UserUtilsService } from '../services/users/user-utils.service';
import { PostUtilsService } from '../services/posts/post-utils.service';
import { Router, ActivatedRoute } from '@angular/router';
import { Post } from '../home/home.component';

@Component({
  templateUrl: './post-list.component.html'
})
export class PostListComponent {
    getEmail: string;
    posts: Post[];
    searchText: string;
    selectedPost: Post;
    showApply: boolean;
    
    // Post to keep track of edits without changing before save
    editPost: Post;
    isOP: boolean;

    constructor(
        private user_utils: UserUtilsService,
        private post_utils: PostUtilsService,
        private route: ActivatedRoute,
        private router: Router
    ) {}

    ngOnInit() {
        this.selectedPost = {
            name: "",
            description: "",
            ownerName: "",
            ownerEmail: "",
            skills: []
        };

        this.editPost = {
            name: "",
            description: "",
            ownerName: "",
            ownerEmail: "",
            skills: []
        };

        this.posts = [];

        this.route.params.subscribe(params => {
            this.getEmail = params['email'];

            this.post_utils.fetchUserPosts(this.getEmail).subscribe((data) => {
                this.parsePosts(data.posts);
            }, (err) => {
                console.log(err);
            });
        }, (err) => {
            console.log(err);
        });
    }

    parsePosts(data) {
        console.log(data);
        data.forEach((item) => {
            let parse: Post = {
                name: item.Name.S,
                description: item.Description.S,
                ownerName: item.OwnerName.S,
                ownerEmail: item.OwnerEmail.S,
                skills: JSON.parse(item.Skills.S)
            };
            if (parse.description === ' ') {
                parse.description = '';
            }
            this.posts.push(parse); 
        })
    }

    checkOP() {
        if (this.selectedPost) { 
            if (this.selectedPost.ownerEmail === this.user_utils.getCurrentUserDetails().email) {
                this.isOP = true;
            } else {
                this.isOP = false;
            }
        }
    }

    displayPost(item) {
        this.selectedPost = item;
        this.copyEditPost();

        this.checkOP();
    }

    copyEditPost() {
        this.editPost.name = this.selectedPost.name;
        this.editPost.description = this.selectedPost.description;
        this.editPost.ownerEmail = this.selectedPost.ownerEmail;
        this.editPost.ownerName = this.selectedPost.ownerName;
        this.editPost.skills = this.selectedPost.skills.slice();
    }
    clearEdit() {
        this.editPost = {
            name: "",
            description: "",
            ownerName: "",
            ownerEmail: "",
            skills: []
        };
    }
}