import { Component } from '@angular/core';
import { UserUtilsService } from '../services/users/user-utils.service';

@Component({
    templateUrl: './users.component.html'
})
export class UsersComponent {
    /* Home user variables */
    users: any[];

    /* Filter variables */
    filterName: string;
    filterSkills: string[];
    filterMajor: string[]

    SKILLS_ARRAY: string[] = [
        'Web Development',
        'Backend Development',
        'Full Stack Development',
        'Project Management',
        'Database Management'
    ];

    constructor(
        private user_utils: UserUtilsService,
    ) { }

    ngOnInit() {
        this.filterSkills = [];
        this.filterMajor = [];
        this.users = [];

        this.user_utils.getAllUsers().subscribe(arr => {
            this.parseUsers(arr.users);
        }, (err) => {
            console.error(err);
        });
    }

    resetFilters() {
        this.filterName = '';
        this.filterSkills = [];
    }

    buildPic(email: string) {
        return this.user_utils.buildProfilePicUrl(email);
    }

    buildAsset(asset: string) {
        return this.user_utils.buildAssetUrl(asset);
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

    routeProfile(str: string) {
        window.location.href = '/profile/' + str;
    }

    filterAddSkill(skill: string) {
        if (!this.filterSkills.includes(skill)) {
            this.filterSkills.push(skill);
        }
    }

    filterDeleteSkill(idx: number) {
        this.filterSkills.splice(idx, 1);
    }
    
    filterAddMajor(skill: string) {
        if (!this.filterMajor.includes(skill)) {
            this.filterMajor.push(skill);
        }
    }

    filterDeleteMajor(idx: number) {
        this.filterMajor.splice(idx, 1);
    }
}