import { Component, Input, Output, OnChanges, SimpleChanges, EventEmitter } from '@angular/core';
import { UserUtilsService } from '../services/users/user-utils.service';
import { PostUtilsService } from '../services/posts/post-utils.service';
import { Post } from './home.component';
import { Router } from '@angular/router';

@Component({
  selector: 'post-modal',
  templateUrl: './post.component.html'
})
  
export class PostComponent implements OnChanges{
  @Input() post: Post;
  @Output() doneEvent = new EventEmitter<boolean>(); 
  @Output() refreshEvent = new EventEmitter<boolean>(); 

  isOP: boolean;
  showApply: boolean; 

  constructor(private user_utils: UserUtilsService, private post_utils: PostUtilsService, private router: Router) {  }

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
      this.refreshEvent.emit(false);
    }, (err) => {
      console.log(err);
    });
  }

  closeModal() {
    this.doneEvent.emit(false);
  }
}