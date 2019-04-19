import { Component } from '@angular/core';
import { UserUtilsService, UserProfile } from '../services/users/user-utils.service';
import { Router } from '@angular/router';

@Component({
  templateUrl: './users.component.html'
})
export class UsersComponent {
    users: any[];
    searchText: string;

    constructor(
        private user_utils: UserUtilsService,
        private router: Router 
    ) { }

    ngOnInit() {
        this.users = [];

        this.user_utils.getAllUsers().subscribe((data) => {
            this.parseUsers(data.users);
        }, (err) => {
            console.log(err);
        })
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

    routeProfile(user: UserProfile) {
        this.router.navigateByUrl('profile/' + user.email);
    }

    buildPic(email: string) {
        return this.user_utils.buildProfilePicUrl(email);
    }
}