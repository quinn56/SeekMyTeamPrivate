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
    
    constructor(
        private user_utils: UserUtilsService,
        private post_utils: PostUtilsService,
        private route: ActivatedRoute,
        private router: Router
    ) {}

    ngOnInit() {
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
}