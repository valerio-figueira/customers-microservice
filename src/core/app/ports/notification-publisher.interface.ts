export interface NotificationPublisherInterface {
  publish(params: NotificationParams): void;
}

export enum NotificationOperation {
  CREATE_CUSTOMER = 'create_customer',
}

export interface NotificationParams {
  operation: NotificationOperation.CREATE_CUSTOMER;
  message: string;
}
