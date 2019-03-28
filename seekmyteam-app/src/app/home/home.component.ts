import { Component } from '@angular/core';
import { PostUtilsService } from '../services/posts/post-utils.service';
import { UserUtilsService, UserProfile } from '../services/users/user-utils.service';

export interface Post {
    name: string,
    description: string,
    ownerName: string,
    ownerEmail: string,
    skills: string[]
}

@Component({
  templateUrl: './home.component.html'
})
export class HomeComponent {
    posts: Post[];
    private LastEvaluatedKey: any; 
    showMore: boolean;
    showModal: boolean;
    selectedPost: Post; 
    newPost: Post;

    SKILLS_ARRAY: string[] = ['java', 'angular', 'project management'];

    constructor(
        private user_utils: UserUtilsService,
        private post_utils: PostUtilsService
    ) {
        this.showMore = true;
        this.showModal = false;
        this.LastEvaluatedKey = null;
        this.selectedPost = null;
        this.newPost = {
            name: "",
            description: "",
            ownerName: "",
            ownerEmail: "",
            skills: []
        };
    }
    
    ngOnInit() {
        this.showModal = false;
        this.newPost = {
            name: "",
            description: "",
            ownerName: "",
            ownerEmail: "",
            skills: []
        };

        this.post_utils.fetchPosts(null).subscribe(data => {
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
            ownerEmail: item.OwnerEmail.S,
            skills: JSON.parse(item.Skills.S)
        };
    }

    addNewPost() {
        this.user_utils.getProfile(this.user_utils.getCurrentUserDetails().email).subscribe(profile => {
            this.post_utils.create(this.newPost.name, this.newPost.description, JSON.stringify(this.newPost.skills), profile.user.name).subscribe(data => {
                this.ngOnInit();    // Repopulate list automatically??
            }, (err) => {
                if (err.status == 401) {
                    console.log('a project with that name already exists')
                } else {
                    console.log('server error: could not create post');
                }
            });
        }, (err) => {
            console.error(err);
        });        
    }

    addSkill(skill: string) {
        document.getElementById("selectSkill").getElementsByTagName('option')[0].selected = true;
        if (!this.newPost.skills.includes(skill)) {
            this.newPost.skills.push(skill);
        }
    }

    deleteSkill(idx: number) {
        this.newPost.skills.splice(idx, 1);
    }

    handleDone($event) {
        this.showModal = $event;
    }

    clearNewPost() {
        this.newPost = {
            name: "",
            description: "",
            ownerName: "",
            ownerEmail: "",
            skills: []
        };
    }
}
