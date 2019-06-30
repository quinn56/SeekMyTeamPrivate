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
    members: string[]
}

@Component({
    templateUrl: './home.component.html'
})
export class HomeComponent {
    currentSelection: string; // Current topic to be displayed 
    
    /* Home project variables */
    posts: Post[];
    private LastEvaluatedKey: any;
    showMore: boolean;

    /* Home user variables */
    users: any[];

    /* Keeps track of a new post */
    newPost: Post;

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
        private date_func: PostDateService
    ) { }

    ngOnInit() {
        this.showMore = true;
        this.LastEvaluatedKey = null;
        this.filterSkills = [];
        this.currentSelection = 'projects'

        this.newPost = {
            name: "",
            description: "",
            ownerName: "",
            ownerEmail: "",
            skills: [],
            date: 0,
            age: "",
            members: []
        };

        this.posts = [];
        this.users = [];
        this.post_utils.fetchPosts(null).subscribe(data => {
            this.parsePosts(data.posts);
            this.sortPosts();
            this.LastEvaluatedKey = data.key;
            this.checkMorePosts();
        }, (err) => {
            console.error(err);
        });

        this.user_utils.getAllUsers().subscribe(arr => {
            this.parseUsers(arr.users);
        }, (err) => {
            console.error(err);
        });
    }

    resetFilters() {
        this.filterSkills = [];
        this.searchText = '';
        this.ownerText = '';
    }

    changeSelection(topic: string) {
        this.resetFilters();
        this.currentSelection = topic;
    }

    buildPic(email: string) {
        return this.user_utils.buildProfilePicUrl(email);
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
    parseUsers(data) {
        data.forEach((item) => {
            let parse = {
                name: item.name,
                description: item.description,
                email: item.email,
                skills: JSON.parse(item.skills)
            };
            this.users.push(parse); 
        })
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
                age: this.date_func.buildDate(parseInt(item.Date.S)),
                members: JSON.parse(item.Members.S)
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
            members: []
        };
    }

    routeProfile(post: Post) {
        this.router.navigateByUrl('/profile/' + post.ownerEmail);
    }
    
    routeProfileString(str: string) {
        this.router.navigateByUrl('/profile/' + str);
    }

    routeProject(post: Post) {
        this.router.navigateByUrl('/project/' + post.name);
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
