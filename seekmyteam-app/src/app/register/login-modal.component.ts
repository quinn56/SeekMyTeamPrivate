import { Component, OnInit } from '@angular/core';
import { LoginPayload, AuthenticationService } from '../services/authentication/authentication.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login-modal',
  templateUrl: './login-modal.component.html',
})
export class LoginModalComponent implements OnInit {
  invalidLoginEmail: boolean = false;
  invalidLoginPassword: boolean = false;
  unconfirmedEmail: boolean = false;
  
  loginCredentials: LoginPayload = {
    email: '',
    password: ''
  };
  constructor(private auth: AuthenticationService, private router: Router) { }

  ngOnInit() {
  }

  login() {
    this.invalidLoginEmail = false;
    this.invalidLoginPassword = false;
    this.auth.login(this.loginCredentials).subscribe(() => {
        //location.reload();
        this.router.navigateByUrl('/');
    }, (err) => {
        if (err.status == 400) {
            this.invalidLoginEmail = true;
        } else if (err.status == 401) {
            this.unconfirmedEmail = true;
        } else if (err.status == 402) {
            this.invalidLoginPassword = true;
        } else {
            console.log('Server error: Could not login')
        }
    });
  }

  clearFields() {
    this.loginCredentials.email = '';
    this.loginCredentials.password = '';
    this.invalidLoginEmail = false;
    this.invalidLoginPassword = false;
    this.unconfirmedEmail = false;
  }
}
