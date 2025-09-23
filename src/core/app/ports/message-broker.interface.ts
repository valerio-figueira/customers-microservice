export interface MessageBrokerInterface {
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
