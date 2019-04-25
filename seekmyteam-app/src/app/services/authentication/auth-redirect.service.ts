import { Injectable } from '@angular/core';
import { Router, CanActivate } from '@angular/router';
import { AuthGuardService } from './auth-guard.service';
import { UserUtilsService } from '../users/user-utils.service';

@Injectable()
export class AuthRedirectService implements CanActivate{

  constructor(private auth_guard: AuthGuardService, private router: Router, private user_utils: UserUtilsService) { }

  canActivate() {
    if (this.auth_guard.isLoggedIn()) {
      this.router.navigateByUrl('/');
      return false;
    } 
    return true;
  }
}
