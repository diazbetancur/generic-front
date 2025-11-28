import { computed, Injectable, signal } from '@angular/core';

/**
 * Servicio de utilidades genéricas
 * Maneja el estado de carga global de la aplicación
 */
@Injectable({
  providedIn: 'root',
})
export class UtilsService {
  /**
   * Contador interno de peticiones activas. Cuando es > 0, loading = true
   */
  private activeRequests = 0;

  /**
   * Signal reactivo de estado de carga global.
   */
  private readonly _loading = signal<boolean>(false);

  /**
   * Computed público para lectura (si en el futuro se quisiera derivar más lógica)
   */
  public readonly loading = computed(() => this._loading());

  /**
   * Incrementa el contador y activa el loading si corresponde
   */
  showLoading(): void {
    this.activeRequests++;
    if (this.activeRequests === 1) {
      this._loading.set(true);
    }
  }

  /**
   * Decrementa el contador y desactiva el loading si llega a 0
   */
  hideLoading(): void {
    if (this.activeRequests > 0) {
      this.activeRequests--;
    }
    if (this.activeRequests === 0) {
      this._loading.set(false);
    }
  }

  /**
   * Estado instantáneo (conveniencia)
   */
  isLoading(): boolean {
    return this._loading();
  }
}
