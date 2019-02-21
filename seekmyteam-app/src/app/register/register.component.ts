import { Component } from '@angular/core';
import { AuthenticationService, RegisterPayload } from '../services/authentication/authentication.service';
import { Router } from '@angular/router';

@Component({
    templateUrl: './register.component.html'
})
export class RegisterComponent {
    credentials: RegisterPayload = {
        email: '',
        name: '',
        password: ''
    };

    constructor(private auth: AuthenticationService, private router: Router) { }

    register() {
        this.auth.register(this.credentials).subscribe(() => {
            this.router.navigateByUrl('/confirm');
        }, (err) => {
            if (err.status == 401) {
                console.log('a user with that email already exists');
            } else {
                console.log('server error: failed to register');
            }
        });
    }
}