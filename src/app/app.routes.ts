import { Routes } from '@angular/router';
import { authMatchGuard } from './core/guards/auth.guard';
import { roleGuard } from './core/guards/role.guard';

/**
 * Rutas principales de la aplicación (Angular 20 standalone)
 * Usa lazy loading para optimizar el bundle inicial
 */
export const routes: Routes = [
  // Ruta pública de login
  {
    path: 'login',
    loadComponent: () =>
      import('./components/login/login.component').then(
        (m) => m.LoginComponent
      ),
  },
  // Shell protegido con LayoutComponent
  {
    path: '',
    canMatch: [authMatchGuard],
    loadComponent: () =>
      import('./components/layout/layout.component').then(
        (m) => m.LayoutComponent
      ),
    children: [
      {
        path: '',
        pathMatch: 'full',
        redirectTo: 'home',
      },
      {
        path: 'home',
        loadComponent: () =>
          import('./components/home/home.component').then(
            (m) => m.HomeComponent
          ),
      },
      {
        path: 'admin',
        canMatch: [authMatchGuard, roleGuard],
        data: { roles: ['Admin'] },
        loadComponent: () =>
          import('./components/home/home.component').then(
            (m) => m.HomeComponent
          ),
      },
    ],
  },
  // Wildcard redirige a login (ya no a home)
  {
    path: '**',
    loadComponent: () =>
      import('./components/error/not-found.component').then(
        (m) => m.NotFoundComponent
      ),
  },
  // Nota: ForbiddenComponent podría usarse así desde RoleGuard
  // router.navigate(['/forbidden']); y añadir ruta:
  // {
  //   path: 'forbidden',
  //   loadComponent: () =>
  //     import('./components/error/forbidden.component').then((m) => m.ForbiddenComponent),
  // },
];
