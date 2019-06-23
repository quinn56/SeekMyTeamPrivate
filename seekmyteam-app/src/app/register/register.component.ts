import { Component } from '@angular/core';
import { AuthenticationService, RegisterPayload, ConfirmPayload } from '../services/authentication/authentication.service';
import { Router } from '@angular/router';
import { AuthGuardService } from '../services/authentication/auth-guard.service';
import { UserUtilsService } from '../services/users/user-utils.service';
import { ActivatedRoute } from '@angular/router';

@Component({
    templateUrl: './register.component.html'
})
export class RegisterComponent {
    credentials: RegisterPayload = {
        email: '',
        name: '',
        password: '',
        school: '',
        major: ''
    };

    confirmCredentials: ConfirmPayload = {
        email: '',
        code: ''
    };

    moreInfo: Object = {
        description: '',
        
    }

    notRegistered: boolean = false;
    serverError: boolean = false;
    invalidCode: boolean = false;

    constructor(private auth: AuthenticationService,
        private auth_guard: AuthGuardService,
        private user_utils: UserUtilsService,
        private router: Router,
        private route: ActivatedRoute) { }

    ngOnInit() {
        
    }

    initConfirm() {
        this.confirmCredentials.email = this.credentials.email;
        console.log("email: ", this.credentials.email);
        // this.route.params.subscribe(params => {
        //     this.confirmCredentials.email = params['email']; 
        //     console.log("params: ", params);
        //     console.log("params[email]: ", params['email']);
        // });
    }
    
    register() {
        if (!this.validateEmail(this.credentials.email)) {
            console.log("invalid purdue email address");
        } else {
            this.auth.register(this.credentials).subscribe((data) => { 
                //this.router.navigateByUrl('/confirm/' + this.credentials.email);
                this.initConfirm();
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
        var re = /\S+@\S+\.\S+/;
        let val = re.test(email);
        if (!val) {
            return false;
        } else {
            if (email.substr(email.indexOf('@')) !== '@purdue.edu') {
                return false;
            }
            return true;
        }
    }

    confirm() {
        console.log(this.confirmCredentials);
        this.auth.confirm(this.confirmCredentials).subscribe(() => {
            this.router.navigateByUrl('/profile/' + this.confirmCredentials.email);
        }, (err) => {
            if (err.status == 401) {
                console.log('you have not registered yet');
                this.notRegistered = true;
            } else if (err.status == 403) {
                console.log('invalid code');
                this.invalidCode = true;
            } else {
                console.log('server error: failed to confirm');
                this.serverError = true;
            }
        });
    }

    skipMoreInfo() {
        this.router.navigateByUrl('/profile/' + this.confirmCredentials.email);
    }

    submitMoreInfo(info: Object) {
        this.router.navigateByUrl('/profile/' + this.confirmCredentials.email);
        
    }
}