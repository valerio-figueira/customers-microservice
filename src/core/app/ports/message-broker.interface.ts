export interface MessageBrokerPublisherInterface {
  publish(options: PublisherOptions): Promise<void>;
}

export enum MessageBrokerPattern {
  CUSTOMER_CREATED = 'customer.created',
}

export interface PublisherOptions {
  pattern: MessageBrokerPattern;
  message: object;
  subject?: string;
}

export type Handler<T = object> = (message: T) => Promise<void>;

export interface MessageBrokerSubscriberInterface<T = object> {
  subscribe(pattern: string, handler: Handler<T>): void;
}
