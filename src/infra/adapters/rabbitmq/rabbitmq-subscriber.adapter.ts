import {
  Injectable,
  Logger,
  OnModuleDestroy,
  OnModuleInit,
} from '@nestjs/common';
import * as amqp from 'amqp-connection-manager';
import { MessageBrokerSubscriberInterface } from '../../../core/app/ports/message-broker.interface';
import { Channel } from 'amqp-connection-manager';
import { ConsumeMessage } from 'amqplib';

@Injectable()
export class RabbitMQSubscriberAdapter
  implements MessageBrokerSubscriberInterface, OnModuleInit, OnModuleDestroy
{
  private connection: amqp.AmqpConnectionManager;
  private channelWrapper: amqp.ChannelWrapper;
  private readonly logger = new Logger(RabbitMQSubscriberAdapter.name);

  constructor(private readonly url: string) {}

  onModuleInit(): void {
    this.connect();
  }

  async onModuleDestroy(): Promise<void> {
    await this.connection?.close();
  }

  private connect(): void {
    this.connection = amqp.connect([this.url]);

    this.connection.on('connect', () => this.logger.log('RabbitMQ connected'));
    this.connection.on('disconnect', (err) =>
      this.logger.error('RabbitMQ disconnected', err?.err),
    );

    this.channelWrapper = this.connection.createChannel({
      setup: async () => {},
    });
  }

  public async subscribe<T>(
    queue: string,
    handler: (message: T) => Promise<void>,
  ): Promise<void> {
    await this.channelWrapper.addSetup(async (channel: Channel) => {
      await channel.assertQueue(queue, { durable: true });
      await channel.consume(queue, async (msg: ConsumeMessage | null) => {
        if (!msg) return;

        try {
          const payload = JSON.parse(msg.content.toString('utf-8')) as T;
          await handler(payload);
          channel.ack(msg);
        } catch (err) {
          this.logger.error(
            `[RabbitMQSubscriber] Error processing message`,
            err,
          );
          // nack para DLQ ou retry
          channel.nack(msg, false, false);
        }
      });
    });
  }
}
