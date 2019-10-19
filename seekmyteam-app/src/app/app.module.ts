import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';

import { AppComponent } from './app.component';
import { Routes, RouterModule } from '@angular/router';

import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { RegisterComponent } from './register/register.component';
import { ConfirmComponent } from './register/confirm.component';
import { ProfileComponent } from './profile/profile.component';
import { NavbarComponent } from './navbar/navbar.component';
import { HomeComponent } from './home/home.component';
import { UsersComponent } from './home/users.component';
import { PostListComponent } from './profile/post-list.component';
import { TeamPageComponent } from './team-page/team-page.component';
import { AlertComponent } from './alerts/alert.component';
import { ComingSoonComponent } from './coming-soon/coming-soon.component';
import { RegisterModalComponent } from './register/register-modal.component';
import { LoginModalComponent } from './register/login-modal.component';
import { FooterComponent } from './footer/footer.component';

import { AuthGuardService } from './services/authentication/auth-guard.service';
import { AuthenticationService } from './services/authentication/authentication.service';
import { AuthRedirectService } from './services/authentication/auth-redirect.service';
import { UserUtilsService } from './services/users/user-utils.service';
import { PostUtilsService } from './services/posts/post-utils.service';
import { AlertService } from './services/alerts/alert.service';
import { PostDateService } from './services/posts/post-date.service';
import { DevKeyService } from './services/authentication/dev-key.service';

import { FilterPipe } from './services/pipes/filter.pipe';
import { SkillsPipe } from './services/pipes/skills.pipe';
import { ReversePipe } from './services/pipes/reverse.pipe';
import { RegisterBetaComponent } from './register-beta/register-beta.component';
import { RegisterBetaModalComponent } from './register-beta/register-beta-modal.component';

const appRoutes: Routes = [
  { path: '', component: HomeComponent, canActivate: [DevKeyService] },
  { path: 'users', component: UsersComponent, canActivate: [DevKeyService] },
  { path: 'register', component: RegisterComponent, canActivate: [DevKeyService] },
  { path: 'profile/:email', component: ProfileComponent, canActivate: [DevKeyService] },
  { path: 'profile/:email/posts', component: PostListComponent, canActivate: [DevKeyService] },
  { path: 'confirm/:email', component: ConfirmComponent, canActivate: [DevKeyService] },
  { path: 'project/:name', component: TeamPageComponent, canActivate: [DevKeyService] },
  { path: 'register-beta', component: RegisterBetaComponent, canActivate: [] },
  { path: 'coming-soon', component: ComingSoonComponent, canActivate: [] },
  { path: '**', redirectTo: '/register-beta' }
];

// const appRoutes: Routes = [
//   { path: '', component: HomeComponent, canActivate: [DevKeyService, AuthGuardService] },
//   { path: 'users', component: HomeComponent, canActivate: [DevKeyService, AuthGuardService] },
//   { path: 'register', component: RegisterComponent, canActivate: [DevKeyService, AuthGuardService] },
//   { path: 'profile/:email', component: ProfileComponent, canActivate: [DevKeyService, AuthGuardService] },
//   { path: 'profile/:email/posts', component: PostListComponent, canActivate: [DevKeyService, AuthGuardService] },
//   { path: 'confirm/:email', component: ConfirmComponent, canActivate: [DevKeyService, AuthGuardService] },
//   { path: 'project/:name', component: TeamPageComponent, canActivate: [DevKeyService, AuthGuardService] },
//   { path: 'register-beta', component: RegisterBetaComponent, canActivate: [] },
//   { path: 'coming-soon', component: ComingSoonComponent, canActivate: [] },
//   { path: '**', redirectTo: '/register-beta' }
// ];

// const appRoutes: Routes = [
//     { path: '', component: HomeComponent, canActivate: [] },
//     { path: 'users', component: UsersComponent, canActivate: [] },
//   { path: 'register', component: RegisterComponent, canActivate: [] },
//   { path: 'register-beta', component: RegisterBetaComponent, canActivate: [] },
//   { path: 'coming-soon', component: ComingSoonComponent, canActivate: [] },
//   { path: 'profile/:email', component: ProfileComponent, canActivate: [] },
//   { path: 'profile/:email/posts', component: PostListComponent, canActivate: [] },
//   { path: 'confirm/:email', component: ConfirmComponent, canActivate: [] },
//   { path: 'project/:name', component: TeamPageComponent, canActivate: [] },
//   { path: '**', redirectTo: '/' }
// ];

@NgModule({
  declarations: [
    AppComponent,
    RegisterComponent,
    ConfirmComponent,
    ProfileComponent,
    NavbarComponent,
    HomeComponent,
    UsersComponent,
    PostListComponent,
    TeamPageComponent,
    AlertComponent,
    FilterPipe,
    SkillsPipe,
    ReversePipe,
    ComingSoonComponent,
    RegisterModalComponent,
    LoginModalComponent,
    FooterComponent,
    RegisterBetaComponent,
    RegisterBetaModalComponent
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    RouterModule.forRoot(appRoutes),
    NgbModule.forRoot(),
    FormsModule,
    ReactiveFormsModule
  ],
  providers: [
    AuthGuardService,
    AuthRedirectService,
    AuthenticationService,
    UserUtilsService,
    PostUtilsService,
    AlertService,
    PostDateService,
    DevKeyService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
