import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { UserUtilsService } from '../services/users/user-utils.service';
import { PostUtilsService } from '../services/posts/post-utils.service';
import { Post } from './home.component';

@Component({
  selector: 'post-modal',
  templateUrl: './post.component.html'
})
  
export class PostComponent implements OnChanges{
  @Input() post: Post;
  isOP: boolean;
  showApply: boolean; 

  constructor(private user_utils: UserUtilsService, private post_utils: PostUtilsService) {  }

  ngOnChanges(changes: SimpleChanges) {
    this.ngOnInit();
  }

  ngOnInit() {
    this.checkOP();
    this.showApply = true;
  }

  checkOP() {
    if (this.post.ownerEmail === this.user_utils.getCurrentUserDetails().email) {
      this.isOP = true;
    } else {
      this.isOP = false;
    }
  }

  apply() {
    this.post_utils.apply(this.post.ownerEmail, this.user_utils.getCurrentUserDetails().email).subscribe(data => {
      this.showApply = false;
    }, (err) => {
      console.log(err);
    });
  }

  deletePost() {
    this.post_utils.delete(this.post.name).subscribe(data => {  
    }, (err) => {
      console.log(err);
    });
  }
}