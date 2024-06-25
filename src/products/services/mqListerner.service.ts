import { Injectable, Logger } from '@nestjs/common';
import { RabbitMQConnection } from '../../rabbit.connection';
import { ProductDTO } from '../dto/product.dto';
import ProductService from './product.service';

@Injectable()
export class MqListerner {
  constructor(
    private mqConnection: RabbitMQConnection,
    private readonly product: ProductService,
  ) {
    this.listen();
  }

  handleIncomingNotification = (msg: string) => {
    try {
      const parsedMessage: ProductDTO[] = JSON.parse(msg);

      Promise.all(
        parsedMessage.map((item) => {
          this.product.decrement(item.id, item.quantity);
        }),
      );

      // Implement your own notification flow
    } catch (error) {
      Logger.error(`Error While Parsing the message`);
    }
  };

  listen = async () => {
    await this.mqConnection.connect();

    await this.mqConnection.consume(this.handleIncomingNotification);
  };
}
