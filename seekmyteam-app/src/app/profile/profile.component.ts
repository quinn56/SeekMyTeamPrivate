import { Component } from '@angular/core';
import { UserUtilsService, UserProfile, UserDetails } from '../services/users/user-utils.service';
import { Router, ActivatedRoute } from '@angular/router';

@Component({
  templateUrl: './profile.component.html'
})
export class ProfileComponent {
  details: UserProfile = {
    email: '',
    name: '',
    description: ''
  };
  private getEmail: string;
  private isCurrentUser: boolean;

  constructor(private user_utils: UserUtilsService, private route: ActivatedRoute, private router: Router) {}

  ngOnInit() { 
    this.isCurrentUser = this.checkCurrentUser();
    
    this.route.params.subscribe(params => {
      this.getEmail = params['email']; 

      this.user_utils.getProfile(this.getEmail).subscribe(profile => {
        this.details = profile.user;
      }, (err) => {
        console.error(err);
      });
    });
  }

  checkCurrentUser() {
    var check: UserDetails;
    check = this.user_utils.getCurrentUserDetails()
  
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
        this.user_utils.logout();
        this.router.navigateByUrl('/login');
      }, (err) => {
        console.log('could not delete profile');
      }) 
    }
  }
}