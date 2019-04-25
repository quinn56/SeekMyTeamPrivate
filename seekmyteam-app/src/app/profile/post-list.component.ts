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

    /* Keeps track of which list to show */
    showApplied: boolean;
    title: string;

    SKILLS_ARRAY: string[] = [
        'Web Development',
        'Backend Development',
        'Full Stack Development',
        'Project Management',
        'Database Management'
    ];
    
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
        this.showApplied = false;
        this.title = 'My Projects';

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

        this.loadUserPosts();
    }

    loadUserPosts() {
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
    
    selectedAddSkill(skill: string) {
        if (!this.editPost.skills.includes(skill)) {
            this.editPost.skills.push(skill);
        }
    }

    selectedDeleteSkill(idx: number) {
        this.editPost.skills.splice(idx, 1);
    }

    saveSelectedPost() {
        this.selectedPost = this.editPost;
        this.post_utils.update(this.selectedPost.name, this.selectedPost.description, JSON.stringify(this.selectedPost.skills)).subscribe(data => {
            location.reload();
        }, (err) => {
            console.log(err);
        })
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
    deletePost(idx:number) {
        this.post_utils.delete(this.selectedPost.name).subscribe(data => {  
            this.posts.splice(idx,1);
        }, (err) => {
            console.log(err);
        });
    }

    toggleMyPosts() {
        this.loadUserPosts();
        this.title = 'My Projects';
        this.showApplied = false;
    }

    toggleAppliedPosts() {
        this.title = 'Applied Projects';
        // this.loadAppliedPosts(); NEED TO WRITE BACKEND FOR THIS
        this.showApplied = true;
    }
}