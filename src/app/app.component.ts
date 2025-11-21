import { Component, OnInit } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { AuthService } from './services/auth.service';
import { filter } from 'rxjs/operators';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  title = 'cardio-front-admin';
  showHeader = true;

  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    // Ocultar header en la página de login
    this.router.events
      .pipe(filter(event => event instanceof NavigationEnd))
      .subscribe((event: any) => {
        const url = event.urlAfterRedirects;
        this.showHeader = !url.includes('/login') && !url.includes('/forgot-password');
        
        // Redirigir al login si no está autenticado y no está en la página de login o forgot-password
        if (!url.includes('/login') && !url.includes('/forgot-password') && !this.authService.isAuthenticated()) {
          this.router.navigate(['/login']);
        }
      });
  }
}

