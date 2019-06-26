import { Component, NgModule } from '@angular/core';
import { AuthenticationService, RegisterPayload, ConfirmPayload } from '../services/authentication/authentication.service';
import { Router } from '@angular/router';
import { AuthGuardService } from '../services/authentication/auth-guard.service';
import { UserUtilsService } from '../services/users/user-utils.service';
import { ActivatedRoute } from '@angular/router';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';

// @NgModule({
//     imports: [
//         FormBuilder,
//         FormGroup,
//         Validators
//     ]
// })

class MoreInfo {
    description: any;
    skills: any[];
    image: Object;
}

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

    moreInfo: MoreInfo = {
        description: '',
        skills: [],
        image: null
    }

    SKILLS_ARRAY: string[] = [
        'Web Development',
        'Backend Development',
        'Full Stack Development',
        'Project Management',
        'Database Management'
    ];

    notRegistered: boolean = false;
    serverError: boolean = false;
    invalidCode: boolean = false;
    validCode: boolean = false;

    nameForm: FormControl;
    emailForm: FormControl;
    passwordForm: FormControl;
    schoolForm: FormControl;
    majorForm: FormControl;

    submitted = false;

    constructor(private auth: AuthenticationService,
        private auth_guard: AuthGuardService,
        private user_utils: UserUtilsService,
        private router: Router,
        private route: ActivatedRoute,
        private formBuilder: FormBuilder) { }

    ngOnInit() { 
        this.nameForm = new FormControl(['', Validators.required]);
        this.emailForm = new FormControl(['', Validators.required], this.validateEmail);
        this.passwordForm = new FormControl(['', Validators.required]);
        this.schoolForm = new FormControl(['', Validators.required]);
        this.majorForm = new FormControl(['', Validators.required]);
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
        this.submitted = true;
        console.log("submitted");
            this.auth.register(this.credentials).subscribe((data) => { 
                this.initConfirm();
            }, (err) => {
                if (err.status == 401) {
                    console.log('a user with that email already exists');
                } else {
                    console.log('server error: failed to register');
                }
            });
            
        
        
    }

    validateEmail(eml: FormControl) {
        let email = eml.value;
        var re = /\S+@\S+\.\S+/;
        let val = re.test(email);
        if (!val) {
            return email;
        } else {
            if (email.indexOf('@') === -1) {
                return {
                    emailDomain: {
                        parsedDomain: email.substr(email.indexOf('@'))
                      }
                };
            }
            else if (email.substr(email.indexOf('@')) !== '@purdue.edu') {
                console.log("returned NOT null");
                return {
                    emailDomain: {
                        parsedDomain: email.substr(email.indexOf('@'))
                      }
                };
            }
            console.log("returned null")
            return null;
        }
    }

    confirm() {
        console.log(this.confirmCredentials);
        this.auth.confirm(this.confirmCredentials).subscribe(() => {
            //this.router.navigateByUrl('/profile/' + this.confirmCredentials.email);
            this.validCode = true;
            this.invalidCode = false;
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

    submitMoreInfo() {
        this.router.navigateByUrl('/profile/' + this.confirmCredentials.email);
        
    }
}