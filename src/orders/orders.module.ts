import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { OrderEntity } from './entities/orders.entitiy';
import { ProductsOrderEntinty } from './entities/productOrder.entity';
import { OrdersController } from './controllers/orders.controller';
import OrderService from './services/order.service';

@Module({
  imports: [TypeOrmModule.forFeature([OrderEntity, ProductsOrderEntinty])],
  providers: [OrderService],
  controllers: [OrdersController],
})
export class OrdersModule {}
