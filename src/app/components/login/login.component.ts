import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../services/auth.service';

/**
 * Componente de Login (Angular 20 standalone)
 * Maneja la autenticación del usuario
 */
@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent {
  private readonly fb = inject(FormBuilder);
  private readonly authService = inject(AuthService);
  private readonly router = inject(Router);

  public appName = '__PROJECT_NAME__';
  public loginForm: FormGroup;
  public loading = false;
  public errorMessage = '';

  constructor() {
    this.loginForm = this.fb.group({
      userName: ['', [Validators.required]],
      password: ['', [Validators.required, Validators.minLength(6)]],
    });
  }

  /**
   * Maneja el submit del formulario de login
   */
  async onSubmit(): Promise<void> {
    if (this.loginForm.invalid) {
      return;
    }

    this.loading = true;
    this.errorMessage = '';
    try {
      await this.authService.login(this.loginForm.value);
      this.router.navigate(['/home']);
    } catch (err) {
      this.errorMessage = 'Usuario o contraseña incorrectos';
    } finally {
      this.loading = false;
    }
  }

  /**
   * Getters para los controles del formulario
   */
  get userName() {
    return this.loginForm.get('userName');
  }

  get password() {
    return this.loginForm.get('password');
  }
}
