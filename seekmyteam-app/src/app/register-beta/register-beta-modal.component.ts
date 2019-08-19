import { Component, ViewChild, ElementRef, OnInit } from '@angular/core';
import { AuthenticationService, RegisterPayload, ConfirmPayload, LoginPayload } from '../services/authentication/authentication.service';
import { Router } from '@angular/router';
import { AuthGuardService } from '../services/authentication/auth-guard.service';
import { UserUtilsService } from '../services/users/user-utils.service';
import { ActivatedRoute } from '@angular/router';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { majors } from '../../data/majors';
import { AlertService } from '../services/alerts/alert.service';

@Component({
  selector: 'app-register-beta-modal',
  templateUrl: './register-beta-modal.component.html',
  exportAs: 'child'
})
export class RegisterBetaModalComponent implements OnInit {
  MAJORS_ARRAY: string[] = majors;

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
  }

    register() {
        this.submitted = true;
        console.log("submitted");
        if (this.emailForm.errors === null) {
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

    finishConfirmation() {
      this.clearConfirmFields();
      this.router.navigateByUrl('/coming-soon');
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
}
