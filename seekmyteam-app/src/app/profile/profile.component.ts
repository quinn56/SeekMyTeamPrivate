import { Component, ViewChild, ElementRef } from '@angular/core';
import { UserUtilsService, UserProfile, UserDetails } from '../services/users/user-utils.service';
import { Router, ActivatedRoute } from '@angular/router';
import { AuthenticationService } from '../services/authentication/authentication.service';

@Component({
  templateUrl: './profile.component.html'
})
export class ProfileComponent {
  acceptedMimeTypes: string[] = [
    'image/gif',
    'image/jpeg',
    'image/png'
  ];

  @ViewChild('fileInput') fileInput: ElementRef;
  fileDataUri: string = '';
  
  details: UserProfile = {
    email: '',
    name: '',
    description: '',
    skills: []
  };

  private getEmail: string;
  
  isCurrentUser: boolean;
  newSkill: string = '';


  constructor(private user_utils: UserUtilsService, private auth: AuthenticationService, private route: ActivatedRoute, private router: Router) {}

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

        this.user_utils.getProfilePic(this.getEmail).subscribe(pic => {
          this.fileDataUri = pic.image;
        }, (err) => {
          console.error(err);
        });
      }, (err) => {
        console.error(err);
      });
    });
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
    this.user_utils.updateProfile(this.details.description, JSON.stringify(this.details.skills)).subscribe(res => {
      console.log('successfully updated profile');
    }, (err) => {
      console.log(err);
    }) 
  }

  addSkill() {
    this.details.skills.push(this.newSkill);
    this.newSkill = '';
  }

  deleteSkill(idx: number) {
    this.details.skills.splice(idx, 1);
  }


  previewFile() {
    const file = this.fileInput.nativeElement.files[0];
    if (file && this.validateFile(file)) {

      const reader = new FileReader();
      reader.readAsDataURL(this.fileInput.nativeElement.files[0]);
      reader.onload = () => {
        this.fileDataUri = reader.result.toString();
      }
    } else {
      console.log('File must be jpg, png, or gif and cannot be exceed 500 KB in size');
    }
  }

  uploadFile(event: Event) {
    event.preventDefault();
    // get only the base64 file and post it
    if (this.fileDataUri.length > 0) {
      //const base64File = this.fileDataUri.split(',')[1];
      this.user_utils.uploadProfilePicture(this.fileDataUri).subscribe(res => {
          // reset file input
          this.fileInput.nativeElement.value = '';
        }, (err) => {
          console.log('Could not upload image.');
      });
    }
  }

  validateFile(file) {
   // return this.acceptedMimeTypes.includes(file.type) && file.size < 500000;
    return true;
  }
}