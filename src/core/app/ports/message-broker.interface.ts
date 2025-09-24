export interface MessageBrokerPublisherInterface {
  publish(options: PublisherOptions): Promise<void>;
}

export enum MessageOperation {
  CUSTOMER_CREATED = 'customer_created',
}

export interface PublisherOptions {
  operation?: MessageOperation.CUSTOMER_CREATED;
  message: object;
  subject?: string;
}

export interface MessageBrokerSubscriberInterface<T = object> {
  subscribe(
    queue: string,
    handler: (message: T) => Promise<void>,
  ): Promise<void>;
}
