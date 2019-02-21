import { Component } from '@angular/core';
import { UserUtilsService, UserProfile } from '../services/users/user-utils.service';
import { ActivatedRoute } from '@angular/router';

@Component({
  templateUrl: './profile.component.html'
})
export class ProfileComponent {
  details: UserProfile = {
    email: '',
    name: '',
    description: ''
  };
  private email: string;

  constructor(private user_utils: UserUtilsService, private route: ActivatedRoute) {}

  ngOnInit() {    
    this.route.params.subscribe(params => {
      this.email = params['email']; 

      this.user_utils.getProfile(this.email).subscribe(user => {
        this.details = user;
      }, (err) => {
        console.error(err);
      });
    });
  }
}