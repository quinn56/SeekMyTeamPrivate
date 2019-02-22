import { Injectable } from '@angular/core';
import { Router, CanActivate } from '@angular/router';
import { AuthGuardService } from './auth-guard.service';
import { UserUtilsService } from '../users/user-utils.service';

@Injectable()
export class AuthRedirectService implements CanActivate{

  constructor(private auth_guard: AuthGuardService, private router: Router, private user_utils: UserUtilsService) { }

  canActivate() {
    if (this.auth_guard.isLoggedIn()) {
      /* Change this to home page when implemented */
      this.router.navigateByUrl('/profile/' + this.user_utils.getCurrentUserDetails().email);
      return false;
    } 
    return true;
  }
}
