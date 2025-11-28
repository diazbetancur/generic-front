// src/app/core/services/notification.service.ts
import { Injectable, signal } from '@angular/core';

export type NotificationType = 'success' | 'error' | 'info' | 'warning';

export interface NotificationMessage {
  id: string;
  type: NotificationType;
  text: string;
  timeout?: number; // ms
}

@Injectable({ providedIn: 'root' })
export class NotificationService {
  private readonly DEFAULT_TIMEOUT = 4500;
  private readonly COOLDOWN_MS = 1500; // evita spam de mensajes iguales en ventana corta
  private lastEmitted: Record<string, number> = {};

  // Cola de mensajes como signal
  private readonly _messages = signal<NotificationMessage[]>([]);
  public readonly messages = this._messages.asReadonly();

  /** API pública */
  success(text: string, timeout?: number): string {
    return this.push({ type: 'success', text, timeout });
  }
  error(text: string, timeout?: number): string {
    return this.push({ type: 'error', text, timeout });
  }
  info(text: string, timeout?: number): string {
    return this.push({ type: 'info', text, timeout });
  }
  warning(text: string, timeout?: number): string {
    return this.push({ type: 'warning', text, timeout });
  }

  clear(id?: string): void {
    if (!id) {
      this._messages.set([]);
      return;
    }
    this._messages.update((list) => list.filter((m) => m.id !== id));
  }

  /** Interno: insertar y programar auto dismiss */
  private push(partial: Omit<NotificationMessage, 'id'>): string {
    // Throttle básico por (type+text)
    const key = `${partial.type}|${partial.text}`;
    const now = Date.now();
    const last = this.lastEmitted[key] || 0;
    if (now - last < this.COOLDOWN_MS) {
      return key + '-suppressed';
    }
    this.lastEmitted[key] = now;

    const id = this.generateId();
    const msg: NotificationMessage = {
      id,
      type: partial.type,
      text: partial.text,
      timeout: partial.timeout ?? this.DEFAULT_TIMEOUT,
    };
    this._messages.update((list) => [msg, ...list]);

    if (msg.timeout && msg.timeout > 0) {
      window.setTimeout(() => this.clear(id), msg.timeout);
    }
    return id;
  }

  private generateId(): string {
    return Math.random().toString(36).slice(2) + Date.now().toString(36);
  }
}
