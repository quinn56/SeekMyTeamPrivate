import { Component } from '@angular/core';
import { AuthenticationService, LoginPayload } from '../services/authentication/authentication.service';
import { AuthGuardService } from '../services/authentication/auth-guard.service';
import { Router } from '@angular/router';
import { UserUtilsService } from '../services/users/user-utils.service';
import { AlertService } from '../services/alerts/alert.service';

@Component({
  templateUrl: './login.component.html'
})
export class LoginComponent {
  credentials: LoginPayload = {
      email: '',
      password: ''
  };

  constructor(private auth: AuthenticationService,
     private alert: AlertService,
     private router: Router) {}

  login() {
    this.auth.login(this.credentials).subscribe(() => {
      location.reload();
      this.router.navigateByUrl('/');
    }, (err) => {
        if (err.status == 400) {
            this.alert.error('No user with that email found');
        } else if (err.status == 401) {  
          this.router.navigateByUrl('/confirm/' + this.credentials.email);
        } else if (err.status == 402) {
            this.alert.error('Incorrect password');
        } else {
            this.alert.error('Server error: Could not login');
        }
    });
  }
}