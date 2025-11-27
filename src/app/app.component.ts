import { CommonModule } from '@angular/common';
import { Component, OnInit, inject } from '@angular/core';
import { NavigationEnd, Router, RouterModule } from '@angular/router';
import { filter } from 'rxjs/operators';
import { HeaderComponent } from './components/header/header.component';
import { AuthService } from './services/auth.service';

/**
 * CHANGE_NAME: Componente raíz de la aplicación (Angular 20 standalone)
 */
@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterModule, HeaderComponent],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit {
  private readonly authService = inject(AuthService);
  private readonly router = inject(Router);

  title = 'CHANGE_NAME'; // CHANGE_NAME: Título de tu aplicación
  showHeader = true;

  ngOnInit(): void {
    // Ocultar header en la página de login
    this.router.events
      .pipe(filter((event) => event instanceof NavigationEnd))
      .subscribe((event) => {
        if (event instanceof NavigationEnd) {
          const url = event.urlAfterRedirects;
          this.showHeader = !url.includes('/login');

          // Redirigir al login si no está autenticado
          if (!url.includes('/login') && !this.authService.isAuthenticated()) {
            this.router.navigate(['/login']);
          }
        }
      });
  }
}
