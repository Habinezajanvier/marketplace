import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { OrderEntity } from './entities/orders.entitiy';
import { OrderItemsEntity } from './entities/productOrder.entity';
import { OrdersController } from './controllers/orders.controller';
import OrderService from './services/order.service';
import { RabbitMQConnection } from '../rabbit.connection';

@Module({
  imports: [TypeOrmModule.forFeature([OrderEntity, OrderItemsEntity])],
  providers: [OrderService, RabbitMQConnection],
  controllers: [OrdersController],
})
export class OrdersModule {}
