import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';

import { AppComponent } from './app.component';
import { routing } from './app.routing';

import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';
import { ConfirmComponent } from './register/confirm.component';
import { ProfileComponent } from './profile/profile.component';

import { AuthGuardService } from './services/authentication/auth-guard.service';
import { AuthenticationService } from './services/authentication/authentication.service';
import { UserUtilsService } from './services/users/user-utils.service';

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
    routing,
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
