import { Injectable, Logger } from '@nestjs/common';
import * as amq from 'amqplib';

// import { rmqUser, rmqPass, rmqhost, NOTIFICATION_QUEUE } from './config';

type HandlerCB = (msg: string) => any;
@Injectable()
export class RabbitMQConnection {
  connection!: amq.Connection;
  channel!: amq.Channel;
  private connected!: boolean;

  async connect() {
    if (this.connected && this.channel) return;
    else this.connected = true;

    try {
      this.connection = await amq.connect(`amqp://localhost:5672`);

      Logger.log(`✅ Rabbit MQ Connection is ready`);

      this.channel = await this.connection.createChannel();

      Logger.log(`🛸 Created RabbitMQ Channel successfully`);
    } catch (error) {
      Logger.error(`Not connected to MQ Server`);
    }
  }

  /**
   * Send message to the que
   * @param queue
   * @param message
   */
  async sendToQueue(queue: string, message: any) {
    try {
      if (!this.channel) {
        await this.connect();
      }

      this.channel.sendToQueue(queue, Buffer.from(JSON.stringify(message)));
    } catch (error) {
      Logger.error(error);
    }
  }

  /**
   * Consume incominingg message from the que
   * @param handleIncomingNotification
   */
  async consume(handleIncomingNotification: HandlerCB) {
    await this.channel.assertQueue('orders', {
      durable: true,
    });

    this.channel.consume(
      'orders',
      (msg) => {
        {
          if (!msg) {
            return console.error(`Invalid incoming message`);
          }
          handleIncomingNotification(msg?.content?.toString());
          this.channel.ack(msg);
        }
      },
      {
        noAck: false,
      },
    );
  }
}
