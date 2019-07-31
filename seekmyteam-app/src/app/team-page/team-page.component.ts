import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { PostUtilsService } from '../services/posts/post-utils.service';
import { UserUtilsService } from '../services/users/user-utils.service';
import { AlertService } from '../services/alerts/alert.service';
import { PostDateService } from '../services/posts/post-date.service';
import { Post, Comment } from '../home/home.component';
import { Observable } from 'rxjs';

@Component({
    templateUrl: './team-page.component.html'
})
export class TeamPageComponent {
    getName: string; // Name of project to display
    post: Post;      // Post retrieved by name
    currentSelection: string; // Current topic to be displayed (post info, members, etc.)
    members: any[];             // Cantians user information for members of this project

    allUsers: any[] // Holds list of users that you can add from 

    /* Post to keep track of edits without changing before save */
    editPost: Post;

    /* Post modal variables */
    isOP: boolean;
    showApply: boolean;

    /* Comments variables */
    comments: Comment[];

    constructor(
        private post_utils: PostUtilsService,
        private alert: AlertService,
        private route: ActivatedRoute,
        private router: Router,
        private date_func: PostDateService,
        private user_utils: UserUtilsService
    ) { }

    ngOnInit() {
        this.currentSelection = 'home';
        this.members = [];
        this.post = {
            name: "",
            description: "",
            ownerName: "",
            ownerEmail: "",
            skills: [],
            date: 0,
            age: "",
            members: [],
            comments: [],
            likes: []
        };

        this.editPost = {
            name: "",
            description: "",
            ownerName: "",
            ownerEmail: "",
            skills: [],
            date: 0,
            age: "",
            members: [],
            comments: [],
            likes: []
        };

        this.route.params.subscribe(params => {
            this.getName = params['name'];

            this.post_utils.fetchPost(this.getName).subscribe((data) => {
                this.post = this.parsePost(data.post);
                this.loadMembers();
                this.comments = JSON.parse(data.post.Comments.S)
            }, (err) => {
                console.log(err);
            });
        }, (err) => {
            console.log(err);
        });
    }

    parsePost(item): Post {
        return {
            name: item.Name.S,
            description: item.Description.S,
            ownerName: item.OwnerName.S,
            ownerEmail: item.OwnerEmail.S,
            skills: JSON.parse(item.Skills.S),
            date: parseInt(item.Date.S),
            age: this.date_func.buildDate(parseInt(item.Date.S)),
            members: JSON.parse(item.Members.S),
            comments: [],
            likes: []
        };
    }

    loadMembers() {
        this.post.members.forEach(member => {
            this.user_utils.getProfile(member).subscribe(data => {
                this.members.push(data.user);
            })
        });
    }

    changeSelection(topic: string) {
        this.currentSelection = topic;
    }

    displayPost() {
        this.copyEditPost();

        this.showApply = true;
        this.checkOP();
    }

    copyEditPost() {
        this.editPost.name = this.post.name;
        this.editPost.description = this.post.description;
        this.editPost.ownerEmail = this.post.ownerEmail;
        this.editPost.ownerName = this.post.ownerName;
        this.editPost.skills = this.post.skills.slice();
    }

    checkOP() {
        if (this.post) {
            if (this.post.ownerEmail === this.user_utils.getCurrentUserDetails().email) {
                this.isOP = true;
            } else {
                this.isOP = false;
            }
        }
    }

    apply() {
        this.post_utils.apply(this.post.ownerEmail, this.user_utils.getCurrentUserDetails().email).subscribe(data => {
            this.showApply = false;
            this.user_utils.markApplied(JSON.stringify(this.post)).subscribe((ret) => {
            }, (err) => {
                console.log(err);
            })
        }, (err) => {
            console.log(err);
        });
    }

    deletePost() {
        this.post_utils.delete(this.post.name).subscribe(data => {
            this.alert.success('Succesfully deleted project');
        }, (err) => {
            console.log(err);
        });
    }

    routeProfileString(str: string) {
        this.router.navigateByUrl('/profile/' + str);
    }

    selectedAddSkill(skill: string) {
        if (!this.editPost.skills.includes(skill)) {
            this.editPost.skills.push(skill);
        }
    }

    selectedDeleteSkill(idx: number) {
        this.editPost.skills.splice(idx, 1);
    }

    savePost() {
        this.post = this.editPost;
        this.post_utils.update(this.post).subscribe(data => {
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
            age: "",
            members: [],
            comments: [],
            likes: []
        };
    }

    addMember(email) {
        this.post.members.push(email);
        this.post_utils.update(this.post).subscribe((res) => {
            console.log("successfully added member");
        }, (err) => {
            console.log(err);
        })
    }

    buildPic(email) {
        return this.user_utils.buildProfilePicUrl(email);
    }

    fetchUsers() {
        this.user_utils.getAllUsers().subscribe(arr => {
            this.parseUsers(arr.users);
        }, (err) => {
            console.error(err);
        });
    }

    parseUsers(data) {
        data.forEach((item) => {
            let parse = {
                name: item.name,
                description: item.description,
                email: item.email,
                skills: JSON.parse(item.skills)
            };
            this.allUsers.push(parse); 
        })
    }

    getComments(name: string) {
        this.post_utils.fetchComments(name).subscribe(data => {
            this.comments = data;
        }, (err) => {
            console.error(err);
        });
    }
}