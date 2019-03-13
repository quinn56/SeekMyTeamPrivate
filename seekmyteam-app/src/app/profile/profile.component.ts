import { Component } from '@angular/core';
import { UserUtilsService, UserProfile, UserDetails } from '../services/users/user-utils.service';
import { Router, ActivatedRoute } from '@angular/router';
import { AuthenticationService } from '../services/authentication/authentication.service';

@Component({
  templateUrl: './profile.component.html'
})
export class ProfileComponent {
  details: UserProfile = {
    email: '',
    name: '',
    description: '',
    skills: []
  };
  private getEmail: string;
  isCurrentUser: boolean;
  newSkill: string = '';

  constructor(private user_utils: UserUtilsService, private auth: AuthenticationService, private route: ActivatedRoute, private router: Router) {}

  ngOnInit() { 
    this.route.params.subscribe(params => {
      this.getEmail = params['email']; 

      this.isCurrentUser = this.checkCurrentUser();

      this.user_utils.getProfile(this.getEmail).subscribe(profile => {
        this.details.email = profile.user.email;
        this.details.name = profile.user.name;
        this.details.description = profile.user.description;
        this.details.skills = JSON.parse(profile.user.skills)
      }, (err) => {
        console.error(err);
      });
    });
  }

  checkCurrentUser() {
    var check: UserDetails;
    check = this.user_utils.getCurrentUserDetails();
    
    return (check.email === this.getEmail); 
  }

  deleteProfile() {
    /* Add a confirmation check here and use handle as callback */
  }

  handleDelete() {
    if (!this.isCurrentUser) {
      console.log('cannot delete another users profile');
    } else {
      this.user_utils.deleteProfile(this.user_utils.getCurrentUserDetails().email).subscribe(res => {
        console.log('successfully deleted profile');
        this.auth.logout();
      }, (err) => {
        console.log('could not delete profile');
      }) 
    }
  }

  updateProfile() {
    this.user_utils.updateProfile(this.details.description, JSON.stringify(this.details.skills)).subscribe(res => {
      console.log('successfully updated profile');
    }, (err) => {
      console.log(err);
    }) 
  }

  addSkill() {
    this.details.skills.push(this.newSkill);
    this.newSkill = '';
  }

  deleteSkill(idx: number) {
    this.details.skills.splice(idx, 1);
  }
}