import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';

import { AppComponent } from './app.component';
import { Routes, RouterModule } from '@angular/router';

import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';
import { ConfirmComponent } from './register/confirm.component';
import { ProfileComponent } from './profile/profile.component';
import { NavbarComponent } from './navbar/navbar.component';

import { AuthGuardService } from './services/authentication/auth-guard.service';
import { AuthenticationService } from './services/authentication/authentication.service';
import { AuthRedirectService } from './services/authentication/auth-redirect.service';
import { UserUtilsService } from './services/users/user-utils.service';

const appRoutes: Routes = [
  { path: '', redirectTo: '/login', pathMatch: 'full' },
  { path: 'login', component: LoginComponent, canActivate: [AuthRedirectService]},
  { path: 'register', component: RegisterComponent, canActivate: [AuthRedirectService] },
  { path: 'profile/:email', component: ProfileComponent, canActivate: [AuthGuardService] },
  { path: 'confirm/:email', component: ConfirmComponent, canActivate: [AuthRedirectService] },
  { path: '**', redirectTo: '/login' }
];

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    RegisterComponent,
    ConfirmComponent,
    ProfileComponent,
    NavbarComponent
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    RouterModule.forRoot(appRoutes),
    NgbModule.forRoot(),
    FormsModule
  ],
  providers: [
    AuthGuardService,
    AuthRedirectService,
    AuthenticationService,
    UserUtilsService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
