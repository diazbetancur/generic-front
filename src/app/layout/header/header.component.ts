import { CommonModule } from '@angular/common';
import { Component, computed, inject } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { APP_MENU } from '../../core/constants/app-menu';
import { AuthService } from '../../services/auth.service';

/**
 * Componente genérico de header/navbar (Angular 20 standalone)
 * Muestra el menú de navegación y opciones de autenticación
 */
@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
})
export class HeaderComponent {
  private readonly authService = inject(AuthService);
  private readonly router = inject(Router);

  public appName = '__PROJECT_NAME__';
  public isMenuOpen = false;

  // Menú dinámico basado en roles y allowedPaths
  public readonly menuItems = computed(() => {
    return APP_MENU.filter((item) => {
      const rolesOk = item.roles
        ? item.roles.some((r) => this.authService.hasRole(r))
        : true;
      const pathOk = this.authService.canAccessPath(item.path);
      return rolesOk && pathOk;
    });
  });

  /**
   * Verifica si el usuario está autenticado
   */
  isAuthenticated(): boolean {
    return this.authService.isAuthenticated();
  }

  /**
   * Toggle del menú móvil
   */
  toggleMenu(): void {
    this.isMenuOpen = !this.isMenuOpen;
  }

  /**
   * Cierra sesión y redirige al login
   */
  logout(): void {
    this.authService.logout();
  }
}
