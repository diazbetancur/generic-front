// src/app/shared/components/notification/notification.component.ts
import { CommonModule } from '@angular/common';
import { Component, computed, inject } from '@angular/core';
import {
  NotificationMessage,
  NotificationService,
} from '../../../core/services/notification.service';

@Component({
  selector: 'app-notification',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './notification.component.html',
  styleUrls: ['./notification.component.scss'],
})
export class NotificationComponent {
  private readonly notification = inject(NotificationService);
  public readonly messages = computed<NotificationMessage[]>(() =>
    this.notification.messages()
  );

  trackById(index: number, item: NotificationMessage): string {
    return item.id;
  }

  close(id: string): void {
    this.notification.clear(id);
  }
}
