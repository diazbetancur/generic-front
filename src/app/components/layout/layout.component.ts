import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { HeaderComponent } from '../header/header.component';

/**
 * LayoutComponent: Shell autenticado que contiene Header y router-outlet
 */
@Component({
  selector: 'app-layout',
  standalone: true,
  imports: [CommonModule, RouterModule, HeaderComponent],
  templateUrl: './layout.component.html',
  styleUrls: ['./layout.component.scss'],
})
export class LayoutComponent {}
