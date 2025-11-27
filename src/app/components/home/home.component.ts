import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { HeaderComponent } from '../header/header.component';

/**
 * CHANGE_NAME: Componente principal de la página de inicio (Angular 20 standalone)
 * Personaliza este componente según las necesidades de tu aplicación
 */
@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, RouterModule, HeaderComponent],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent {
  // CHANGE_NAME: Define aquí las propiedades de tu componente
  public appName = 'CHANGE_NAME';
}
