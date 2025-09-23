export interface QueueSendOptions<T = object> {
  queueUrl: string;
  message: T;
  delaySeconds?: number; // apenas SQS
}

export interface QueueReceiveOptions {
  queueUrl: string;
  maxMessages?: number;
  waitTimeSeconds?: number;
  maxNumberOfMessages?: number; // apenas SQS
}

export interface ConsumedQueueMessage<T = object> {
  messageId?: string;
  body: T;
  receiptHandle?: string; // usado para delete em SQS
}

export interface QueueClientInterface {
  sendMessage<T = object>(options: QueueSendOptions<T>): Promise<void>;
  receiveMessages<T = object>(
    options: QueueReceiveOptions,
  ): Promise<ConsumedQueueMessage<T>[]>;
}
