import { Component } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
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

    constructor(
        private user_utils: UserUtilsService,
        private post_utils: PostUtilsService,
        private alert: AlertService,
        private router: Router,
        private route: ActivatedRoute,
        private date_func: PostDateService
    ) { }
    
    ngOnInit() {
        this.currentSelection = 'home';

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
}
