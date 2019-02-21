import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';

import { AppComponent } from './app.component';
import { Routes, RouterModule } from '@angular/router';

import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';
import { ConfirmComponent } from './register/confirm.component';
import { ProfileComponent } from './profile/profile.component';

import { AuthGuardService } from './services/authentication/auth-guard.service';
import { AuthenticationService } from './services/authentication/authentication.service';
import { UserUtilsService } from './services/users/user-utils.service';

const appRoutes: Routes = [
  { path: '', redirectTo: '/login', pathMatch:'full' },
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'profile/:email', component: ProfileComponent, canActivate: [AuthGuardService] },
  { path: 'confirm/:email', component: ConfirmComponent},
  { path: '**', redirectTo: '/login' }
];

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    RegisterComponent,
    ConfirmComponent,
    ProfileComponent
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    RouterModule.forRoot(appRoutes),
    FormsModule
  ],
  providers: [
    AuthGuardService,
    AuthenticationService,
    UserUtilsService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
