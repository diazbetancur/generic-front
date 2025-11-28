import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';

/**
 * Componente principal de la página de inicio (Angular 19 standalone)
 * Personaliza este componente según las necesidades de tu aplicación
 */
@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent {
  public appName = '__PROJECT_NAME__';
}
