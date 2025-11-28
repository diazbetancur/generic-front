import { Component } from '@angular/core';
import { Observable } from 'rxjs';
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
  public loading$: Observable<boolean>;

  constructor(private readonly utilsService: UtilsService) {
    this.loading$ = this.utilsService.loading$;
  }
}
