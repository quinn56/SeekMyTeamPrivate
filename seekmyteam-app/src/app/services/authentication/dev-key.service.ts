import { Injectable } from '@angular/core';
import { Router, CanActivate, ActivatedRoute } from '@angular/router';
import { environment } from '../../../environments/environment.prod';

@Injectable()
export class DevKeyService implements CanActivate {

  constructor(private activated_route: ActivatedRoute, private router: Router) {}

  key: string;
  ngOnInit() {

  }
  
  canActivate() {
    this.key = localStorage.getItem('key')

    if (!this.key || this.key !== environment.devkey) {
      window.location.href = '/register-beta';
      return false;
    }

    return true;
  }
}