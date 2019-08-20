import { Component, ViewChild, ElementRef, OnInit } from '@angular/core';
import { AuthenticationService, RegisterPayload, ConfirmPayload, LoginPayload } from '../services/authentication/authentication.service';
import { Router } from '@angular/router';
import { AuthGuardService } from '../services/authentication/auth-guard.service';
import { UserUtilsService } from '../services/users/user-utils.service';
import { ActivatedRoute } from '@angular/router';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { engineering_majors } from '../../data/majors';
import { AlertService } from '../services/alerts/alert.service';

class MoreInfo {
  description: string;
  skills: string[];
  image: Object;
  howDidYouHear : string;
}

@Component({
  selector: 'app-register-modal',
  templateUrl: './register-modal.component.html',
  exportAs: 'child'
})
export class RegisterModalComponent implements OnInit {

  @ViewChild('fileInput') fileInput: ElementRef;
    unconfirmedEmail: boolean;

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
        image: null,
        howDidYouHear: ''
    }

    skills: any[] = [
        { name: 'Web Development', selected: false}, 
        { name: 'Backend Development', selected: false},
        { name: 'Full Stack Development', selected: false},
        { name: 'Project Management', selected: false},
        { name: 'Database Management', selected: false},
    ];

    ENGINEERING_MAJORS_ARRAY: string[] = engineering_majors;

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
    betaTester;
    successfulRegistration = false;

    constructor(private auth: AuthenticationService,
        private auth_guard: AuthGuardService,
        private user_utils: UserUtilsService,
        private router: Router,
        private route: ActivatedRoute,
        private formBuilder: FormBuilder,
        private alert: AlertService) { }

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
            this.successfulRegistration = true;
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
        this.clearMoreInfoFields();
    }

    submitMoreInfo() {
        this.uploadFile();
        if (this.moreInfo.description.length === 0) {
            this.moreInfo.description = ' ';
        }
        this.assembleSkills();
        this.user_utils.updateProfile(this.moreInfo.description,
        JSON.stringify(this.moreInfo.skills), 'https://www.facebook.com', 'https://www.linkedin.com', 'https://github.com').subscribe(res => {
            //doesn't work correctly yet
            this.uploadFile();
            console.log("email: ", this.confirmCredentials.email);
            this.router.navigateByUrl('/profile/' + this.confirmCredentials.email);
        }, (err) => {
            console.log(err);
        })
        this.clearMoreInfoFields();
    }

    uploadFile() {
        let formData = new FormData();
        formData.append('image', this.fileInput.nativeElement.files[0]);
        console.log("formData: ", formData);
        this.user_utils.uploadProfilePicture(formData).subscribe((res) => {
            console.log("uploaded success!!");
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

    clearRegisterFields() {
      this.credentials.name = '';
      this.credentials.email = '';
      this.credentials.password = '';
      this.credentials.school = '';
      this.credentials.major = '';
      this.credentials.minor = '';
      this.invalidEmail = false;
      this.nameForm.markAsUntouched();
      this.emailForm.markAsUntouched();
      this.passwordForm.markAsUntouched();
      this.schoolForm.markAsUntouched();
      this.majorForm.markAsUntouched();
      this.minorForm.markAsUntouched();
      this.submitted = false;
    }

    clearConfirmFields() {
      this.confirmCredentials.code = '';
      //this.confirmCredentials.email = '';
      this.notRegistered = false;
      this.invalidCode = false;
      this.validCode = false;
      this.serverError = false;
    }

    clearMoreInfoFields() {
      this.moreInfo.description = '';
      this.moreInfo.image = null;
      this.moreInfo.skills = [];
    }
}
