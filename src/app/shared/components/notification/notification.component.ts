import { Component, OnInit, OnDestroy, AfterViewInit } from '@angular/core';
import { NotificationService, Notification, NotificationType } from '../../../services/notification.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-notification',
  templateUrl: './notification.component.html',
  styleUrls: ['./notification.component.scss']
})
export class NotificationComponent implements OnInit, OnDestroy, AfterViewInit {
  notifications: Notification[] = [];
  private subscription: Subscription = new Subscription();

  constructor(private notificationService: NotificationService) {}

  ngOnInit(): void {
    this.subscription = this.notificationService.notifications$.subscribe(notification => {
      this.addNotification(notification);
    });
  }

  ngAfterViewInit(): void {
    // Asegurar que el contenedor esté en el DOM
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  addNotification(notification: Notification): void {
    this.notifications.push(notification);

    // Auto-remover después de la duración especificada
    if (notification.duration && notification.duration > 0) {
      setTimeout(() => {
        this.removeNotification(notification.id);
      }, notification.duration);
    }
  }

  removeNotification(id: string): void {
    const index = this.notifications.findIndex(n => n.id === id);
    if (index > -1) {
      // Agregar clase de salida para animación
      const notificationElement = document.querySelector(`[data-notification-id="${id}"]`);
      if (notificationElement) {
        notificationElement.classList.add('notification-exit');
        setTimeout(() => {
          this.notifications.splice(index, 1);
        }, 300); // Duración de la animación de salida
      } else {
        this.notifications.splice(index, 1);
      }
    }
  }

  getIcon(type: NotificationType): string {
    switch (type) {
      case 'success':
        return '✓';
      case 'error':
        return '✕';
      case 'warning':
        return '⚠';
      case 'info':
        return 'ℹ';
      default:
        return 'ℹ';
    }
  }

  getNotificationClass(type: NotificationType): string {
    return `notification-${type}`;
  }
}

