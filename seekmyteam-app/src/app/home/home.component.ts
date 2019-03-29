import { Component, ChangeDetectorRef } from '@angular/core';
import { PostUtilsService } from '../services/posts/post-utils.service';
import { UserUtilsService } from '../services/users/user-utils.service';
import { Router } from '@angular/router';

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
    /* Home variables */    
    posts: Post[];
    private LastEvaluatedKey: any; 
    showMore: boolean;
    selectedPost: Post; 
    newPost: Post;

    /* Post modal variables */
    isOP: boolean;
    showApply: boolean; 

    SKILLS_ARRAY: string[] = ['java', 'angular', 'project management'];

    constructor(
        private user_utils: UserUtilsService,
        private post_utils: PostUtilsService,
        private router: Router,
        private changes: ChangeDetectorRef
    ) {
        this.showMore = true;
        this.LastEvaluatedKey = null;
        this.selectedPost = {
            name: "",
            description: "",
            ownerName: "",
            ownerEmail: "",
            skills: []
        };
        this.newPost = {
            name: "",
            description: "",
            ownerName: "",
            ownerEmail: "",
            skills: []
        };
    }
    
    ngOnInit() {
        this.newPost = {
            name: "",
            description: "",
            ownerName: "",
            ownerEmail: "",
            skills: []
        };
        this.selectedPost = {
            name: "",
            description: "",
            ownerName: "",
            ownerEmail: "",
            skills: []
        };
        // this.posts = [
        //     {
        //         name: 'jeetsaball',
        //         description: "a big ol jeeetsabll On my Philly to Atlanta flight today we carried home a fallen service member Delta Airlines conducted a very respectful and dignified ceremony whe",
        //         ownerEmail: 'abc@anc.com',
        //         ownerName: 'JEETO',
        //         skills: ['java', 'html', 'the strap']
        //     }
        // ];
        this.posts = [];
        this.post_utils.fetchPosts(null).subscribe(data => {
            this.parsePosts(data.posts);
            this.LastEvaluatedKey = data.key; 
            this.checkMorePosts();
        }, (err) => {
            console.error(err);
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
            this.posts.push(parse); 
        })
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
        this.checkOP();
        this.showApply = true;
        this.selectedPost = item;
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

    clearNewPost() {
        this.newPost = {
            name: "",
            description: "",
            ownerName: "",
            ownerEmail: "",
            skills: []
        };
    }
    
    profileRedirect() {
        this.router.navigateByUrl('/profile/' + this.selectedPost.ownerEmail);
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

    apply() {
        this.post_utils.apply(this.selectedPost.ownerEmail, this.user_utils.getCurrentUserDetails().email).subscribe(data => {
            this.showApply = false;
        }, (err) => {
            console.log(err);
        });
    }

    deletePost() {
        this.post_utils.delete(this.selectedPost.name).subscribe(data => {  
        }, (err) => {
            console.log(err);
        });
    }


    selectedAddSkill(skill: string) {
        if (!this.selectedPost.skills.includes(skill)) {
            this.selectedPost.skills.push(skill);
        }
    }

    selectedDeleteSkill(idx: number) {
        this.selectedPost.skills.splice(idx, 1);
    }

    saveSelectedPost() {
        this.post_utils.update(this.selectedPost.name, this.selectedPost.description, JSON.stringify(this.selectedPost.skills)).subscribe(data => {
        }, (err) => {
            console.log(err);
        })
    }
}
