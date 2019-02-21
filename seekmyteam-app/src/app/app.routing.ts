import { Routes, RouterModule} from '@angular/router';

import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';
import { ConfirmComponent } from './register/confirm.component';
import { ProfileComponent } from './profile/profile.component';
import { AppComponent } from './app.component';
import { AuthGuardService } from './services/authentication/auth-guard.service';

const appRoutes: Routes = [
    { path: '', component: AppComponent, canActivate: [AuthGuardService] },
    { path: 'login', component: LoginComponent },
    { path: 'register', component: RegisterComponent },
    { path: 'profile/:email', component: ProfileComponent, canActivate: [AuthGuardService] },
    { path: 'confirm', component: ConfirmComponent},
    { path: '**', redirectTo: 'login' }
];

export const routing = RouterModule.forRoot(appRoutes);