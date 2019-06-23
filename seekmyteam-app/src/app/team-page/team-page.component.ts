import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { PostUtilsService } from '../services/posts/post-utils.service';
import { UserUtilsService } from '../services/users/user-utils.service';
import { AlertService } from '../services/alerts/alert.service';
import { PostDateService } from '../services/posts/post-date.service';
import { Post } from '../home/home.component';

@Component({
    templateUrl: './team-page.component.html'
})
export class TeamPageComponent {
    getName: string; // Name of project to display
    post: Post;      // Post retrieved by name
    currentSelection: string; // Current topic to be displayed 

    /* Post to keep track of edits without changing before save */
    editPost: Post;

    /* Post modal variables */
    isOP: boolean;
    showApply: boolean;

    constructor(
        private post_utils: PostUtilsService,
        private alert: AlertService,
        private route: ActivatedRoute,
        private date_func: PostDateService,
        private user_utils: UserUtilsService
    ) { }

    ngOnInit() {
        this.currentSelection = 'home';
        this.post = {
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

        this.route.params.subscribe(params => {
            this.getName = params['name'];

            this.post_utils.fetchPost(this.getName).subscribe((data) => {
                this.post = this.parsePost(data.post);
            }, (err) => {
                console.log(err);
            });
        }, (err) => {
            console.log(err);
        });
    }

    parsePost(item) {
        return {
            name: item.Name.S,
            description: item.Description.S,
            ownerName: item.OwnerName.S,
            ownerEmail: item.OwnerEmail.S,
            skills: JSON.parse(item.Skills.S),
            date: parseInt(item.Date.S),
            age: this.date_func.buildDate(parseInt(item.Date.S))
        };
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
        this.post_utils.update(this.post.name, this.post.description, JSON.stringify(this.post.skills)).subscribe(data => {
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
}
