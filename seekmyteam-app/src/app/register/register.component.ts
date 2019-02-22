import { Component } from '@angular/core';
import { AuthenticationService, RegisterPayload } from '../services/authentication/authentication.service';
import { Router } from '@angular/router';
import { AuthGuardService } from '../services/authentication/auth-guard.service';
import { UserUtilsService } from '../services/users/user-utils.service';

@Component({
    templateUrl: './register.component.html'
})
export class RegisterComponent {
    credentials: RegisterPayload = {
        email: '',
        name: '',
        password: ''
    };

    constructor(private auth: AuthenticationService,
        private auth_guard: AuthGuardService,
        private user_utils: UserUtilsService,
        private router: Router) { }
    
    register() {
        if (!this.validateEmail(this.credentials.email)) {
            console.log("invalid purdue email address");
        } else {
            this.auth.register(this.credentials).subscribe(() => {
                this.router.navigateByUrl('/confirm/' + this.credentials.email);
            }, (err) => {
                if (err.status == 401) {
                    console.log('a user with that email already exists');
                } else {
                    console.log('server error: failed to register');
                }
            });
        }
    }

    validateEmail(email: string): boolean {
       /* var re = /\S+@\S+\.\S+/;
        let val = re.test(email);
        if (!val) {
            return false;
        } else {
            if (email.substr(email.indexOf('@')) !== '@purdue.edu') {
                return false;
            }
            return true;
        }*/
        return true;
    }
}