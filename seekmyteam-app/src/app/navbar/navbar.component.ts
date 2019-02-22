import { Component, OnInit } from '@angular/core';
import { AuthenticationService } from '../services/authentication/authentication.service';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent {
  isCollapsed: Boolean = true;
  constructor(private auth: AuthenticationService) { }
  
  logout() {
    this.auth.logout();
  }
}
