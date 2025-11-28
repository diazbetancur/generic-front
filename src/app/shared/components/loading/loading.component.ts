import { Component, computed, inject } from '@angular/core';
import { UtilsService } from '../../services/utils.service';

/**
 * Componente de loading global
 * Se muestra automáticamente cuando hay peticiones HTTP en curso
 */
@Component({
  selector: 'app-loading',
  templateUrl: './loading.component.html',
  styleUrls: ['./loading.component.scss'],
})
export class LoadingComponent {
  private readonly utils = inject(UtilsService);
  // Computed para exponer la lectura del signal (permite futuras derivaciones)
  public readonly loading = computed(() => this.utils.loading());
}
