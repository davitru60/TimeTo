import { Routes } from '@angular/router';
import { HomeComponent } from './pages/home/home.component';
import { LoginComponent } from './pages/auth/login/login.component';
import { RegisterComponent } from './pages/auth/register/register.component';
import { AllProjectsComponent } from './pages/projects/all-projects/all-projects.component';
import { SingleProjectComponent } from './pages/projects/single-project/single-project.component';
import { authGuard } from './core/guards/auth.guard';
import { AdministrationComponent } from './pages/admin/administration/administration.component';
import { MyAccountComponent } from './pages/user/my-account/my-account.component';
import { authRedirectGuard } from './core/guards/authRedirect.guard';
import { adminGuard } from './core/guards/admin.guard';
import { ProjectPreferencesComponent } from './pages/projects/project-preferences/project-preferences.component';


export const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'login', component: LoginComponent, canActivate: [authGuard] },
  { path: 'projects', component: AllProjectsComponent },
  { path: 'projects/:id', component: SingleProjectComponent },
  { path: 'projects-preferences', component: ProjectPreferencesComponent},
  { path: 'administration', component:AdministrationComponent, canActivate:[adminGuard]},
  { path: 'my-account', component:MyAccountComponent, canActivate: [authRedirectGuard]}
 

];
