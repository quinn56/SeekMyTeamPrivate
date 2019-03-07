import { Component } from '@angular/core';
import { AuthenticationService, LoginPayload } from '../services/authentication/authentication.service';
import { AuthGuardService } from '../services/authentication/auth-guard.service';
import { Router } from '@angular/router';
import { UserUtilsService } from '../services/users/user-utils.service';

@Component({
  templateUrl: './login.component.html'
})
export class LoginComponent {
  credentials: LoginPayload = {
      email: '',
      password: ''
  };

  constructor(private auth: AuthenticationService,
     private auth_guard: AuthGuardService,
     private user_utils: UserUtilsService,
     private router: Router) {}

  login() {
    this.auth.login(this.credentials).subscribe(() => {
      this.router.navigateByUrl('/');
    }, (err) => {
        console.log(JSON.stringify(err));
        if (err.status == 400) {
            console.log('no user with that email found');
        } else if (err.status == 401) {
            this.router.navigateByUrl('/confirm/' + this.credentials.email);
        } else if (err.status == 402) {
            console.log('incorrect password');
        } else {
            console.log('server error: could not login');
        }
    });
  }
}