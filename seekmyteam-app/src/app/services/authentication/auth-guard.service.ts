import { Injectable } from '@angular/core';
import { Router, CanActivate } from '@angular/router';
import { AuthenticationService } from './authentication.service';
import { UserUtilsService } from '../users/user-utils.service';

@Injectable()
export class AuthGuardService implements CanActivate {

  constructor(private auth: AuthenticationService, private user_utils: UserUtilsService, private router: Router) {}

  canActivate() {
    if (!this.isLoggedIn()) {
      this.router.navigateByUrl('/login');
      return false;
    }
    return true;
  }

  public isLoggedIn(): boolean {
    const user = this.user_utils.getCurrentUserDetails();
    if (user) {
      return user.exp > Date.now() / 1000;
    } else {
      return false;
    }
  }
}