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
    age: string,
    members: string[],
    comments: Comment[],
    likes: string[]
}

export interface Comment {
    commentOwnerEmail: string,
    commentOwner: string,
    commentText: string,
    date: string,
    age: string
}

@Component({
    templateUrl: './home.component.html',
})
export class HomeComponent {
    /* Home project variables */
    posts: Post[];
    private LastEvaluatedKey: any;
    showMore: boolean;
    openCommentField: boolean;
    comments: Comment[];

    currentUserEmail: string;
    openCommentIdx: number;
    showComments: number[];

    /* Keeps track of a new post */
    newPost: Post;

    /* Keeps track of a new comment */
    newCommentText: string;

    /* Filter variables */
    searchText: string;
    filterSkills: string[];
    ownerText: string;

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
        private date_func: PostDateService,
    ) { }

    ngOnInit() {
        this.showMore = true;
        this.LastEvaluatedKey = null;
        this.filterSkills = [];
        this.newCommentText = "";
        this.currentUserEmail = this.user_utils.getCurrentUserDetails().email;
        this.openCommentIdx = -1;
        this.showComments = [];
        
        this.newPost = {
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

        this.posts = [];
        this.post_utils.fetchPosts(null).subscribe(data => {
            this.parsePosts(data.posts);
            this.sortPosts();
            this.LastEvaluatedKey = data.key;
            this.checkMorePosts();
            this.initShowComment();
        }, (err) => {
            console.error(err);
        });
    }

    toggleCommentBox(idx) {
        if (this.openCommentIdx == idx)
            this.openCommentIdx = -1;
        else
            this.openCommentIdx = idx;
    }

    toggleCommentsDisplay(idx) {
        if (this.showComments.includes(idx))
            this.showComments.splice(this.showComments.indexOf(idx), 1);
        else
            this.showComments.push(idx);
    }

    initShowComment() {
        for (let i = 0; i < this.posts.length; i++) 
            this.showComments.push(i);
    }

    resetFilters() {
        this.filterSkills = [];
        this.searchText = '';
        this.ownerText = '';
    }

    buildPic(email: string) {
        return this.user_utils.buildProfilePicUrl(email);
    }

    buildAsset(asset: string) {
        return this.user_utils.buildAssetUrl(asset);
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
        this.posts = this.post_utils.parsePosts(data);
    }

    parseComments(comments: string) {
        let arr = JSON.parse(comments);
        let ret = [];
        arr.forEach(element => {
            let parse: Comment = {
                commentOwner: element.commentOwner,
                commentOwnerEmail: element.commentOwnerEmail,
                commentText: element.commentText,
                date: element.date,
                age: this.date_func.buildDate(parseInt(element.date))
            }
            ret.push(parse);
        });
        return ret;
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

    addNewPost() {
        if (this.newPost.name.length === 0) {
            this.alert.error('Post must have a name');
            return;
        }

        this.user_utils.getProfile(this.currentUserEmail).subscribe(profile => {
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

    addNewComment(post: Post) {
        if (this.newCommentText.length == 0)
            return

        this.user_utils.getProfile(this.currentUserEmail).subscribe(profile => {
            let currentUserName = profile.user.name;

            let newComment = {
                commentOwnerEmail: this.currentUserEmail,
                commentOwner: currentUserName,
                commentText: this.newCommentText,
                date: Date.now().toString(),
                age: this.date_func.buildDate(parseInt(Date.now().toString()))
            };

            post.comments.push(newComment);

            this.post_utils.update(post).subscribe(res => {
                this.post_utils.comment(post.ownerEmail, currentUserName, post.name).subscribe(data => {
                    this.ngOnInit();
                }, (err) => {
                    console.log(err);
                })
            }, (err) => {
                this.alert.error('Server error: Could not add comment');
            });
        }, (err) => {
            console.log(err);
        });
    }

    like(post: Post) {
        let currentUser = this.user_utils.getCurrentUserDetails().email;
        post.likes.push(currentUser);

        this.post_utils.update(post).subscribe(res => {
            this.post_utils.like(post.ownerEmail, currentUser, post.name).subscribe(data => {
                this.ngOnInit();
            }, (err) => {
                console.log(err);
            })
        }, (err) => {
            console.log(err);
        });
    }

    getComments(name: string) {
        this.post_utils.fetchComments(name).subscribe(data => {

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
            age: "",
            members: [],
            comments: [],
            likes: []
        };
    }

    routeProfile(post: Post) {
        window.location.href = '/profile/' + post.ownerEmail;
    }

    routeProfileString(str: string) {
        window.location.href = '/profile/' + str;
    }

    routeProject(post: Post) {
        window.location.href = '/project/' + post.name;
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
