import { Injectable } from '@angular/core';
import { Subject, Observable } from 'rxjs';

export type NotificationType = 'success' | 'error' | 'warning' | 'info';

export interface Notification {
  id: string;
  type: NotificationType;
  title: string;
  message: string;
  duration?: number;
  showCloseButton?: boolean;
}

@Injectable({
  providedIn: 'root'
})
export class NotificationService {
  private notificationsSubject = new Subject<Notification>();
  public notifications$: Observable<Notification> = this.notificationsSubject.asObservable();

  private notificationIdCounter = 0;

  private showNotification(type: NotificationType, title: string, message: string, duration?: number): void {
    const notification: Notification = {
      id: `notification-${++this.notificationIdCounter}-${Date.now()}`,
      type,
      title,
      message,
      duration: duration || (type === 'error' ? 6000 : 4000),
      showCloseButton: true
    };

    this.notificationsSubject.next(notification);
  }

  success(title: string, message: string = '', duration?: number): void {
    this.showNotification('success', title, message, duration);
  }

  error(title: string, message: string = '', duration?: number): void {
    this.showNotification('error', title, message, duration);
  }

  warning(title: string, message: string = '', duration?: number): void {
    this.showNotification('warning', title, message, duration);
  }

  info(title: string, message: string = '', duration?: number): void {
    this.showNotification('info', title, message, duration);
  }
}

