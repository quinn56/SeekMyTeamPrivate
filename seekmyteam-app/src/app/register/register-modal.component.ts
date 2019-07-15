import { Component, ViewChild, ElementRef, OnInit } from '@angular/core';
import { AuthenticationService, RegisterPayload, ConfirmPayload, LoginPayload } from '../services/authentication/authentication.service';
import { Router } from '@angular/router';
import { AuthGuardService } from '../services/authentication/auth-guard.service';
import { UserUtilsService } from '../services/users/user-utils.service';
import { ActivatedRoute } from '@angular/router';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { majors } from '../../data/majors';
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
  countries : any = ["Afghanistan","Albania","Algeria","Andorra","Angola","Anguilla","Antigua & Barbuda","Argentina","Armenia","Aruba","Australia","Austria","Azerbaijan","Bahamas","Bahrain","Bangladesh","Barbados","Belarus","Belgium","Belize","Benin","Bermuda","Bhutan","Bolivia","Bosnia & Herzegovina","Botswana","Brazil","British Virgin Islands","Brunei","Bulgaria","Burkina Faso","Burundi","Cambodia","Cameroon","Canada","Cape Verde","Cayman Islands","Central Arfrican Republic","Chad","Chile","China","Colombia","Congo","Cook Islands","Costa Rica","Cote D Ivoire","Croatia","Cuba","Curacao","Cyprus","Czech Republic","Denmark","Djibouti","Dominica","Dominican Republic","Ecuador","Egypt","El Salvador","Equatorial Guinea","Eritrea","Estonia","Ethiopia","Falkland Islands","Faroe Islands","Fiji","Finland","France","French Polynesia","French West Indies","Gabon","Gambia","Georgia","Germany","Ghana","Gibraltar","Greece","Greenland","Grenada","Guam","Guatemala","Guernsey","Guinea","Guinea Bissau","Guyana","Haiti","Honduras","Hong Kong","Hungary","Iceland","India","Indonesia","Iran","Iraq","Ireland","Isle of Man","Israel","Italy","Jamaica","Japan","Jersey","Jordan","Kazakhstan","Kenya","Kiribati","Kosovo","Kuwait","Kyrgyzstan","Laos","Latvia","Lebanon","Lesotho","Liberia","Libya","Liechtenstein","Lithuania","Luxembourg","Macau","Macedonia","Madagascar","Malawi","Malaysia","Maldives","Mali","Malta","Marshall Islands","Mauritania","Mauritius","Mexico","Micronesia","Moldova","Monaco","Mongolia","Montenegro","Montserrat","Morocco","Mozambique","Myanmar","Namibia","Nauro","Nepal","Netherlands","Netherlands Antilles","New Caledonia","New Zealand","Nicaragua","Niger","Nigeria","North Korea","Norway","Oman","Pakistan","Palau","Palestine","Panama","Papua New Guinea","Paraguay","Peru","Philippines","Poland","Portugal","Puerto Rico","Qatar","Reunion","Romania","Russia","Rwanda","Saint Pierre & Miquelon","Samoa","San Marino","Sao Tome and Principe","Saudi Arabia","Senegal","Serbia","Seychelles","Sierra Leone","Singapore","Slovakia","Slovenia","Solomon Islands","Somalia","South Africa","South Korea","South Sudan","Spain","Sri Lanka","St Kitts & Nevis","St Lucia","St Vincent","Sudan","Suriname","Swaziland","Sweden","Switzerland","Syria","Taiwan","Tajikistan","Tanzania","Thailand","Timor L'Este","Togo","Tonga","Trinidad & Tobago","Tunisia","Turkey","Turkmenistan","Turks & Caicos","Tuvalu","Uganda","Ukraine","United Arab Emirates","United Kingdom","United States of America","Uruguay","Uzbekistan","Vanuatu","Vatican City","Venezuela","Vietnam","Virgin Islands (US)","Yemen","Zambia","Zimbabwe"];

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

    MAJORS_ARRAY: string[] = majors;

    notRegistered: boolean = false;
    serverError: boolean = false;
    invalidCode: boolean = false;
    validCode: boolean = false;
    invalidEmail: boolean = false;
    unconfirmedEmail: boolean = false;

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
            this.clearRegisterFields();
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
            this.clearConfirmFields();
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
        JSON.stringify(this.moreInfo.skills), 'facebook.com', 'linkedin.com').subscribe(res => {
            console.log("uploaded correctly");
            //doesn't work correctly yet
            //this.uploadFile();
            this.router.navigateByUrl('/profile/' + this.confirmCredentials.email);
            this.clearMoreInfoFields();
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
      this.confirmCredentials.email = '';
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
