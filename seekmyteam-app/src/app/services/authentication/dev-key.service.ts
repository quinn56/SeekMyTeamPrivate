import { Injectable } from '@angular/core';
import { Router, CanActivate, ActivatedRouteSnapshot } from '@angular/router';
import { environment } from '../../../environments/environment.prod';

@Injectable()
export class DevKeyService implements CanActivate {

  constructor(private activated_route: ActivatedRouteSnapshot, private router: Router) {}

  key: string;

  canActivate() {
    if (!this.activated_route.params.key)
        return false;

    this.key = this.activated_route.params.key;
    if (this.key !== 'pqpjwbjrvbanskdckmzdsnviusgbyibrg') {
      this.router.navigateByUrl('/register-beta');
      return false;
    }
    return true;
  }
}