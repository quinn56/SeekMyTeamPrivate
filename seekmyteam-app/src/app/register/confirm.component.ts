import { Component } from '@angular/core';
import { AuthenticationService, ConfirmPayload } from '../services/authentication/authentication.service';
import { Router } from '@angular/router';
import { ActivatedRoute } from '@angular/router';

@Component({
    templateUrl: './confirm.component.html'
})
export class ConfirmComponent {
    credentials: ConfirmPayload = {
        email: '',
        code: ''
    };

    constructor(private auth: AuthenticationService, private router: Router, private route: ActivatedRoute) { }

    ngOnInit() {
        this.route.params.subscribe(params => {
            this.credentials.email = params['email']; 
        });
    }

    confirm() {
        this.auth.confirm(this.credentials).subscribe(() => {
            this.router.navigateByUrl('/profile/' + this.credentials.email);
        }, (err) => {
            if (err.status == 401) {
                console.log('you have not registered yet');
            } else if (err.status == 403) {
                console.log('invalid code');
            } else {
                console.log('server error: failed to confirm');
            }
        });
    }
}