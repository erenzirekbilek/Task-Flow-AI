import { Company } from './database';

export type EventType = 'COMPANY_ADDED' | 'COMPANY_DELETED' | 'COMPANY_UPDATED';

export interface AppEvent {
  type: EventType;
  timestamp: Date;
  data: any;
}

class EventBus {
  private listeners: Map<EventType, Function[]> = new Map();

  emit(type: EventType, data: any): void {
    const event: AppEvent = { type, timestamp: new Date(), data };
    const listeners = this.listeners.get(type) || [];
    listeners.forEach(fn => fn(event));
  }

  on(type: EventType, callback: Function): void {
    const listeners = this.listeners.get(type) || [];
    listeners.push(callback);
    this.listeners.set(type, listeners);
  }
}

export const eventBus = new EventBus();