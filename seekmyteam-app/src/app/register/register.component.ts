import { Component, ViewChild, ElementRef } from '@angular/core';
import { AuthenticationService, RegisterPayload, ConfirmPayload } from '../services/authentication/authentication.service';
import { Router } from '@angular/router';
import { AuthGuardService } from '../services/authentication/auth-guard.service';
import { UserUtilsService } from '../services/users/user-utils.service';
import { ActivatedRoute } from '@angular/router';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { majors } from '../../data/majors';

class MoreInfo {
    description: any;
    skills: string[];
    image: Object;
}

class SelectedSkills {
    wd: boolean;
    bd: boolean;
    fsd: false;
    pm: false;
    dm: false;
}

@Component({
    templateUrl: './register.component.html'
})
export class RegisterComponent {
    @ViewChild('fileInput') fileInput: ElementRef;

    credentials: RegisterPayload = {
        email: '',
        name: '',
        password: '',
        school: '',
        major: '',
        minor: ''
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

    // skills: SelectedSkills = {
    //     wd: false,
    //     bd: false,
    //     fsd: false,
    //     pm: false,
    //     dm: false
    // }

    skills: any[] = [
        { name: 'Web Development', selected: false}, 
        { name: 'Backend Development', selected: false},
        { name: 'Full Stack Development', selected: false},
        { name: 'Project Management', selected: false},
        { name: 'Database Management', selected: false},
    ];

    MAJORS_ARRAY: string[] = majors;

    notRegistered: boolean = false;
    serverError: boolean = false;
    invalidCode: boolean = false;
    validCode: boolean = false;
    invalidEmail: boolean = false;

    nameForm: FormControl;
    emailForm: FormControl;
    passwordForm: FormControl;
    schoolForm: FormControl;
    majorForm: FormControl;
    minorForm: FormControl;

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
        this.minorForm = new FormControl(['']);
     }

    initConfirm() {
        this.confirmCredentials.email = this.credentials.email;
        //console.log("email: ", this.credentials.email);
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
                    this.invalidEmail = true;
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
                return {
                    emailDomain: {
                        parsedDomain: email.substr(email.indexOf('@'))
                      }
                };
            }
            return null;
        }
    }

    confirm() {
        this.auth.confirm(this.confirmCredentials).subscribe(() => {
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
        this.uploadFile();
        if (this.moreInfo.description.length === 0) {
            this.moreInfo.description = ' ';
        }
        this.assembleSkills();
        // console.log(this.moreInfo.description);
        // console.log(this.moreInfo.skills)
        this.user_utils.updateProfile(this.moreInfo.description,
        JSON.stringify(this.moreInfo.skills), 'facebook.com', 'linkedin.com').subscribe(res => {
            console.log("uploaded correctly");
            //doesn't work correctly yet
            //this.uploadFile();
            this.router.navigateByUrl('/profile/' + this.confirmCredentials.email);
        }, (err) => {
            console.log(err);
        })

    }

    uploadFile() {
        let formData = new FormData();
        formData.append('image', this.fileInput.nativeElement.files[0]);
        console.log(this.fileInput.nativeElement.files[0]);
        this.user_utils.uploadProfilePicture(formData).subscribe((res) => {
            console.log("uploaded correctly");
            if (res.imageUrl) {
            location.reload();
            }
        }, (err) => {
            console.log(err);
        })
    }

    assembleSkills() {
        for (var i = 0; i < 5; i++) {
            if (this.skills[i].selected)
                this.moreInfo.skills.push(this.skills[i].name);
        }
    }
}