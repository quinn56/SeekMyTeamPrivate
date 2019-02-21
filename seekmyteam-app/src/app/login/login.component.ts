import { Component } from '@angular/core';
import { AuthenticationService, LoginPayload } from '../services/authentication/authentication.service';
import { Router } from '@angular/router';

@Component({
  templateUrl: './login.component.html'
})
export class LoginComponent {
  credentials: LoginPayload = {
      email: '',
      password: ''
  };

  constructor(private auth: AuthenticationService, private router: Router) {}


  ngOnInit() {
    console.log('login component');
  }

  login() {
    this.auth.login(this.credentials).subscribe(() => {
      this.router.navigateByUrl('/profile');
    }, (err) => {
        if (err.status == 400) {
            console.log('no user with that email found');
        } else if (err.status == 401) {
            this.router.navigateByUrl('/confirm');
        } else if (err.status == 402) {
            console.log('incorrect password');
        } else {
            console.log('server error: could not login');
        }
    });
  }
}