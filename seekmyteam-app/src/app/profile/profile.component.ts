import { Component, ViewChild, ElementRef } from '@angular/core';
import { UserUtilsService, UserProfile, UserDetails } from '../services/users/user-utils.service';
import { Router, ActivatedRoute } from '@angular/router';
import { AuthenticationService } from '../services/authentication/authentication.service';
import { NavbarComponent } from '../navbar/navbar.component';

@Component({
  providers: [NavbarComponent],
  templateUrl: './profile.component.html'
})
export class ProfileComponent {
  acceptedMimeTypes: string[] = [
    'image/gif',
    'image/jpeg',
    'image/png'
  ];

  @ViewChild('fileInput') fileInput: ElementRef;
  fileDataUrl: string = '';
  
  details: UserProfile = {
    email: '',
    name: '',
    description: '',
    skills: [],
    facebook: '',
    linkedin: ''
  };

  private getEmail: string;
  isCurrentUser: boolean;

  SKILLS_ARRAY: string[] = [
    'Web Development',
    'Backend Development',
    'Full Stack Development',
    'Project Management',
    'Database Management'
  ];

  constructor(
    private user_utils: UserUtilsService,
    private auth: AuthenticationService,
    private route: ActivatedRoute,
    private router: Router,
    private navComp: NavbarComponent
  ) {}

  ngOnInit() { 
    this.loadProfile();
  }

  loadProfile() {
    this.route.params.subscribe(params => {
      this.getEmail = params['email']; 

      this.isCurrentUser = this.checkCurrentUser();

      this.user_utils.getProfile(this.getEmail).subscribe(profile => {
        this.details.email = profile.user.email;
        this.details.name = profile.user.name;
        this.details.description = profile.user.description;
        this.details.skills = JSON.parse(profile.user.skills);
        this.details.facebook = profile.user.facebook;
        this.details.linkedin = profile.user.linkedin;
        
        this.fileDataUrl = this.user_utils.buildProfilePicUrl(this.getEmail);

        this.handleSpaces();
      }, (err) => {
        if (err.status === 401) {
          console.log('user with that email not found');
          this.router.navigateByUrl('/');
        }
        console.error(err);
      });
    });
  }

  handleSpaces() {
    if (this.details.description === ' ') {
      this.details.description = '';
    }
    if (this.details.facebook === ' ') {
      this.details.facebook = '';
    }
    if (this.details.linkedin === ' ') {
      this.details.linkedin = '';
    }
  }

  addSpaces() {
    if (this.details.description.length === 0) {
      this.details.description = ' ';
    }
    if (this.details.facebook.length === 0) {
      this.details.facebook = ' ';
    }
    if (this.details.linkedin.length === 0) {
      this.details.linkedin = ' ';
    }
  }

  checkCurrentUser() {
    var check: UserDetails;
    check = this.user_utils.getCurrentUserDetails();
    
    return (check.email === this.getEmail); 
  }

  deleteProfile() {
    /* Add a confirmation check here and use handle as callback */
  }

  handleDelete() {
    if (!this.isCurrentUser) {
      console.log('cannot delete another users profile');
    } else {
      this.user_utils.deleteProfile(this.user_utils.getCurrentUserDetails().email).subscribe(res => {
        console.log('successfully deleted profile');
        this.auth.logout();
      }, (err) => {
        console.log('could not delete profile');
      }) 
    }
  }

  updateProfile() {
    // :( dynamodb
    this.addSpaces();

    this.user_utils.updateProfile(
      this.details.description,
      JSON.stringify(this.details.skills),
      this.details.facebook,
      this.details.linkedin
    ).subscribe(res => {
      this.uploadFile();
      console.log('successfully updated profile');
    }, (err) => {
      console.log(err);
    }) 
  }

  addSkill(skill: string) {
    if (!this.details.skills.includes(skill)) {
      this.details.skills.push(skill);
    }
  }

  deleteSkill(idx: number) {
    this.details.skills.splice(idx, 1);
  }

  /*previewFile() {
    const file = this.fileInput.nativeElement.files[0];
    if (file) {
      const reader = new FileReader();
      reader.readAsDataURL(this.fileInput.nativeElement.files[0]);
      reader.onload = () => {
        this.fileDataUrl = reader.result.toString();
      }
    } else {
      console.log('File must be jpg, png, or gif and cannot be exceed 500 KB in size');
    }
  }*/

  uploadFile() {
    let formData = new FormData();
    formData.append('image', this.fileInput.nativeElement.files[0]);
    this.user_utils.uploadProfilePicture(formData).subscribe((res) => {
      if (res.imageUrl) {
        // this.fileDataUrl = res.imageUrl;
        // this.navComp.profilePic = res.imageUrl;
        location.reload();
      }
    }, (err) => {
      console.log(err);
    })
  }

  directFacebook() {
    window.location.href = this.details.facebook;
  }
  
  directLinkedin() {
    window.location.href = this.details.linkedin;
  }
}