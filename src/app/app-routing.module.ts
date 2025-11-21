import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './components/home/home.component';
import { LoginComponent } from './components/login/login.component';
import { ForgotPasswordComponent } from './components/forgot-password/forgot-password.component';
import { RolesComponent } from './components/roles/roles.component';
import { StateComponent } from './components/state/state.component';
import { RequestTypeComponent } from './components/request-type/request-type.component';
import { FrequentQuestionComponent } from './components/frequent-question/frequent-question.component';
import { AuthGuard } from './core/guards/auth.guard';
import { RoleGuard } from './core/guards/role.guard';

const routes: Routes = [
  { path: '', redirectTo: '/login', pathMatch: 'full' },
  { path: 'login', component: LoginComponent },
  { path: 'forgot-password', component: ForgotPasswordComponent },
  { path: 'home', component: HomeComponent, canActivate: [AuthGuard] },
  { path: 'roles', component: RolesComponent, canActivate: [AuthGuard] },
  { path: 'state', component: StateComponent, canActivate: [AuthGuard] },
  { path: 'request-type', component: RequestTypeComponent, canActivate: [AuthGuard] },
  { path: 'frequent-question', component: FrequentQuestionComponent, canActivate: [AuthGuard] },
  // Ejemplo de ruta con guard de roles:
  // { path: 'admin', component: AdminComponent, canActivate: [AuthGuard, RoleGuard], data: { roles: ['admin'] } },
  { path: '**', redirectTo: '/home' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }

