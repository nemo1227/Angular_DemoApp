import { Routes } from '@angular/router';
import { LoginComponent } from './authentication/login/login.component';
import { HomeComponent } from './landingpage/home/home.component';
import { ResetPasswordComponent } from './authentication/reset-password/reset-password.component';
const routeConfig: Routes = 
[
    {path: '',component: LoginComponent,},
    {path: 'home',component: HomeComponent,},
    {path: 'reset-password', component: ResetPasswordComponent }
];
export default routeConfig;