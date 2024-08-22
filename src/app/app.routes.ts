import { Routes } from '@angular/router';
import { AuthGuard } from './auth/auth.guard';
import { NavComponent } from './components/nav/nav.component';

export const routes: Routes = [
  { path: 'login', loadComponent:() => import('./components/login/login.component').then((m) => m.LoginComponent)},
  {
    path: '',
    loadComponent:() => import('./components/nav/nav.component').then((m) => m.NavComponent),
    canActivate: [AuthGuard], // Protege as rotas filhas
    children: [
      { path: 'dashboard', loadComponent:() => import('./components/dashboard/dashboard.component').then((m) => m.DashboardComponent)},
    ],
  },
];
