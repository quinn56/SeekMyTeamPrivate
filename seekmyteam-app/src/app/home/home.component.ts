import { Component, Pipe, PipeTransform } from '@angular/core';
import { Router } from '@angular/router';
import { PostUtilsService } from '../services/posts/post-utils.service';
import { UserUtilsService } from '../services/users/user-utils.service';
import { AlertService } from '../services/alerts/alert.service';
import { PostDateService } from '../services/posts/post-date.service';
import { CommaExpr } from '@angular/compiler';

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
    openComment: boolean,
    showComments: boolean
}

export interface Comment {
    commentOwnerEmail: string,
    commentOwner: string,
    commentText: string,
    date: string,
    age: string
}

@Pipe({ name: 'reverse', pure: false })
export class ReversePipe implements PipeTransform {
    transform(values) {
        if (values) {
            return values.slice().reverse();
        }
    }
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

    /* Keeps track of a new post */
    newPost: Post;

    /* Keeps track of a new comment */
    newComment: Comment;

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
        private router: Router,
        private date_func: PostDateService,
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
            age: "",
            members: [],
            comments: [],
            openComment: false,
            showComments: true
        };

        this.newComment = {
            commentOwnerEmail: "",
            commentOwner: "",
            commentText: "",
            date: "",
            age: ""
        }

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

    openCommentDialog(post: Post) {
        if (post.openComment === true)
            post.openComment = false;
        else
            post.openComment = true;
    }

    toggleCommentsDisplay(post: Post) {
        if (post.showComments === true)
            post.showComments = false;
        else
            post.showComments = true;
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
        data.forEach((item) => {
            this.comments = [];
            if (item.Comment !== undefined) {
                let comment = JSON.parse(item.Comment.S);
                var i;
                for (i = 0; i < comment.length; i++) {
                    let cmt: Comment = {
                        commentOwnerEmail: comment[i].commentOwnerEmail,
                        commentOwner: comment[i].commentOwner,
                        commentText: comment[i].commentText,
                        date: comment[i].date,
                        age: this.date_func.buildDate(parseInt(comment[i].date))
                    }
                    this.comments.push(cmt);
                }
            }

            let parse: Post = {
                name: item.Name.S,
                description: item.Description.S,
                ownerName: item.OwnerName.S,
                ownerEmail: item.OwnerEmail.S,
                skills: JSON.parse(item.Skills.S),
                date: parseInt(item.Date.S),
                age: this.date_func.buildDate(parseInt(item.Date.S)),
                members: JSON.parse(item.Members.S),
                comments: this.comments,
                openComment: false,
                showComments: true
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

    addNewComment(post: Post) {
        console.log(post.name);
        this.post_utils.fetchComments(post.name).subscribe(data => {
            console.log("here")
            this.user_utils.getProfile(this.user_utils.getCurrentUserDetails().email).subscribe(profile => {
                this.newComment.commentOwnerEmail = profile.user.email;
                this.newComment.commentOwner = profile.user.name;
                this.newComment.date = Date.now().toString()
                console.log("owner title: ", post.name);
                console.log("comment owner email: ", this.newComment.commentOwnerEmail);
                console.log("comment owner: ", this.newComment.commentOwner);
                console.log("comment text: ", this.newComment.commentText);
                console.log("existing comments: ", data.comments);
                if (data.comments === undefined)
                    data.comments = [];
                this.post_utils.commentUpdate(data.comments, post.name, this.newComment).subscribe(data => {
                    this.ngOnInit();    // Repopulate list automatically??
                }, (err) => {
                    if (err.status == 401) {
                        this.alert.error('Weird error')
                    } else {
                        this.alert.error('Server error: Could not add comment');
                    }
                });
            }, (err) => {
                console.error(err);
            });
        }, (err) => {
            console.error(err);
        })
        
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
            openComment: false,
            showComments: true
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
