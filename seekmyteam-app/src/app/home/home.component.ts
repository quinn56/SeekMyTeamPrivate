import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { PostUtilsService } from '../services/posts/post-utils.service';
import { UserUtilsService } from '../services/users/user-utils.service';
import { AlertService } from '../services/alerts/alert.service';
import { PostDateService } from '../services/posts/post-date.service';

export interface Post {
    name: string,
    description: string,
    ownerName: string,
    ownerEmail: string,
    skills: string[],
    date: number,
    age: string
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
    
    /* Post to keep track of edits without changing before save */
    editPost: Post;

    /* Keeps track of a new post */ 
    newPost: Post;
    
    /* Filter variables */
    searchText: string;
    filterSkills: string[];
    ownerText: string;

    /* Post modal variables */
    isOP: boolean;
    showApply: boolean; 

    SKILLS_ARRAY: string[] = [
        'Web Development',
        'Backend Development',
        'Full Stack Development',
        'Project Management',
        'Database Management'
    ];

    constructor(
        private user_utils: UserUtilsService,
        private post_utils: PostUtilsService,
        private alert: AlertService,
        private router: Router,
        private date_func: PostDateService
    ) { }
    
    ngOnInit() {
        this.showMore = true;
        this.LastEvaluatedKey = null;
        this.filterSkills = [];

        this.newPost = {
            name: "",
            description: "",
            ownerName: "",
            ownerEmail: "",
            skills: [],
            date: 0,
            age: ""
        };
        this.selectedPost = {
            name: "",
            description: "",
            ownerName: "",
            ownerEmail: "",
            skills: [],
            date: 0,
            age: ""
        };

        this.editPost = {
            name: "",
            description: "",
            ownerName: "",
            ownerEmail: "",
            skills: [],
            date: 0,
            age: ""
        };

        this.posts = [];
        
        this.post_utils.fetchPosts(null).subscribe(data => {
            this.parsePosts(data.posts);
            this.sortPosts();
            this.LastEvaluatedKey = data.key; 
            this.checkMorePosts();
        }, (err) => {
            console.error(err);
        });
    }
    
    addSpaces() {
        if (this.newPost.description.length === 0) {
            this.newPost.description = ' ';
        }
    }

    sortPosts() {
        this.posts.sort(this.compare);
    }

    compare(a, b) {
        const A = a.date;
        const B = b.date;
      
        let comparison = 0;
        if (A > B) {
          comparison = -1;
        } else if (A < B) {
          comparison = 1;
        }
        return comparison;
      }

    parsePosts(data) {
        data.forEach((item) => {
            let parse: Post = {
                name: item.Name.S,
                description: item.Description.S,
                ownerName: item.OwnerName.S,
                ownerEmail: item.OwnerEmail.S,
                skills: JSON.parse(item.Skills.S),
                date: parseInt(item.Date.S),
                age: this.date_func.buildDate(parseInt(item.Date.S))
            };
            if (parse.description === ' ') {
                parse.description = '';
            }
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
        this.selectedPost = item;
        this.copyEditPost();

        this.showApply = true;
        this.checkOP();
    }

    copyEditPost() {
        this.editPost.name = this.selectedPost.name;
        this.editPost.description = this.selectedPost.description;
        this.editPost.ownerEmail = this.selectedPost.ownerEmail;
        this.editPost.ownerName = this.selectedPost.ownerName;
        this.editPost.skills = this.selectedPost.skills.slice();
    }

    addNewPost() {
        if (this.newPost.name.length === 0) {
            this.alert.error('Post must have a name');
            return;
        }

        this.user_utils.getProfile(this.user_utils.getCurrentUserDetails().email).subscribe(profile => {
            this.post_utils.create(this.newPost.name, this.newPost.description, JSON.stringify(this.newPost.skills), profile.user.name).subscribe(data => {
                this.ngOnInit();    // Repopulate list automatically??
            }, (err) => {
                if (err.status == 401) {
                    this.alert.error('A project with that name already exists')
                } else {
                    this.alert.error('Server error: Could not create post');
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
            skills: [],
            date: 0,
            age: ""
        };
    }
    
    profileRedirect() {
        this.router.navigateByUrl('/profile/' + this.selectedPost.ownerEmail);
    }
    
    routeProfile(post: Post) {
        this.router.navigateByUrl('/profile/' + post.ownerEmail);
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
            this.user_utils.markApplied(JSON.stringify(this.selectedPost)).subscribe((ret) => {
            }, (err) => {
                console.log(err);
            }) 
        }, (err) => {
            console.log(err);
        });
    }

    deletePost(idx:number) {
        this.post_utils.delete(this.selectedPost.name).subscribe(data => {  
            this.posts.splice(idx,1);
        }, (err) => {
            console.log(err);
        });
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
            skills: [],
            date: 0,
            age: ""
        };
    }

    filterAddSkill(skill: string) {
        if (!this.filterSkills.includes(skill)) {
            this.filterSkills.push(skill);
        }
    }

    filterDeleteSkill(idx: number) {
        this.filterSkills.splice(idx, 1);
    }
}
