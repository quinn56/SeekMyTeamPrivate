import { Injectable } from '@angular/core';
import { Router, CanActivate, ActivatedRoute } from '@angular/router';
import { environment } from '../../../environments/environment.prod';

@Injectable()
export class DevKeyService implements CanActivate {

  constructor(private activated_route: ActivatedRoute, private router: Router) {}

  canActivate() {
    if (!this.validateDevKey()) {
      this.router.navigateByUrl('/register-beta');
      return false;
    }
    return true;
  }

  private validateDevKey() {
    this.activated_route.queryParams.subscribe(params => {
        let key = params['key'];

        if (key !== environment.devkey) {
            return false;
        }
    });
    return true;
  }
}