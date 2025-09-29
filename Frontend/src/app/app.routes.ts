import { Routes } from '@angular/router';
import { LoginComponent } from './authentication/login/login.component';
import { HomeComponent } from './landingpage/home/home.component';
const routeConfig: Routes = 
[
    {path: '',component: LoginComponent,},
    {path: 'home',component: HomeComponent,}
];
export default routeConfig;