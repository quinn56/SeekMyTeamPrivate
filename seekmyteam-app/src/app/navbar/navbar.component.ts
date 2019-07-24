import { Component, OnChanges } from '@angular/core';
import { AuthenticationService } from '../services/authentication/authentication.service';
import { AuthGuardService } from '../services/authentication/auth-guard.service';
import { UserUtilsService } from '../services/users/user-utils.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-navbar',
<<<<<<< HEAD
  templateUrl: './navbar.component.html',
=======
  templateUrl: './navbar.component.html'
>>>>>>> home-page
})
export class NavbarComponent implements OnChanges {
  profilePic: string;
  isCollapsed: Boolean = true;
  currentEmail: string;
  searchText: string;
  userInitials: string;
  
  constructor(
    private auth: AuthenticationService,
    private authGuard: AuthGuardService,
    private user_utils: UserUtilsService,
    private router: Router
  ) {
   }

  ngOnInit() {
    this.currentEmail = this.user_utils.getCurrentUserDetails().email;
    this.profilePic = this.user_utils.buildProfilePicUrl(this.currentEmail);
    this.buildInitials()
  }

  isLoggedIn() {
    return this.authGuard.isLoggedIn();
  }

  ngOnChanges() {
    this.ngOnInit();
  }

  routeProfile() {
    this.currentEmail = this.user_utils.getCurrentUserDetails().email;
    window.location.href = '/profile/' + this.currentEmail;
  }

  routeMyProjects() {
    this.currentEmail = this.user_utils.getCurrentUserDetails().email;
    window.location.href = '/profile/' + this.currentEmail + '/posts';
  }

  logout() {
    this.auth.logout();
  }

  buildInitials() {
    this.user_utils.getProfile(this.currentEmail).subscribe((profile) => {
      let name: string = profile.user.name;

      if (name.split(' ').length > 1) {
        this.userInitials = name.split(' ')[0].charAt(0) + name.split(' ')[1].charAt(0);
      } else {
        this.userInitials = name.charAt(0);
      }
    }, (err) => { 
      console.log(err)
    })
  }
}
