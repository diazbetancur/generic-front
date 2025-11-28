// src/app/core/services/form-error.service.ts
import { Injectable } from '@angular/core';
import { AbstractControl } from '@angular/forms';

@Injectable({ providedIn: 'root' })
export class FormErrorService {
  getErrorMessage(
    control: AbstractControl | null,
    fieldName?: string
  ): string | null {
    if (!control) return null;
    const errors = control.errors;
    if (!errors) return null;

    const label = fieldName || 'Este campo';

    if (errors['required']) {
      return `${label} es obligatorio.`;
    }

    if (errors['minlength']) {
      const requiredLength = errors['minlength']?.requiredLength;
      return `${label} debe tener al menos ${requiredLength} caracteres.`;
    }

    if (errors['email']) {
      return 'Ingresa un correo válido.';
    }

    if (errors['pattern']) {
      return 'Formato inválido.';
    }

    return 'Valor inválido.';
  }
}
