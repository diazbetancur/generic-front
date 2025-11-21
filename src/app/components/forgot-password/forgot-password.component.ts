import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.component.html',
  styleUrls: ['./forgot-password.component.scss']
})
export class ForgotPasswordComponent implements OnInit {
  forgotPasswordForm: FormGroup;
  loading = false;
  emailSent = false;
  errorMessage: string | null = null;
  successMessage: string | null = null;

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private authService: AuthService
  ) {
    this.forgotPasswordForm = this.fb.group({
      userNameOrEmail: ['', [Validators.required]]
    });
  }

  ngOnInit(): void {
  }

  onSubmit(): void {
    if (this.forgotPasswordForm.valid) {
      this.loading = true;
      this.errorMessage = null;
      
      this.authService.forgotPassword({
        userNameOrEmail: this.forgotPasswordForm.value.userNameOrEmail
      }).subscribe({
        next: (response) => {
          this.loading = false;
          this.emailSent = true;
          this.successMessage = response.message;
        },
        error: (error) => {
          this.loading = false;
          this.errorMessage = error.error?.message || 'Ocurrió un error al procesar la solicitud';
        }
      });
    } else {
      Object.keys(this.forgotPasswordForm.controls).forEach(key => {
        this.forgotPasswordForm.get(key)?.markAsTouched();
      });
    }
  }

  goToLogin(): void {
    this.router.navigate(['/login']);
  }

  get userNameOrEmail() {
    return this.forgotPasswordForm.get('userNameOrEmail');
  }
}

