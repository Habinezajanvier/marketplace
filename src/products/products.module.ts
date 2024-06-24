import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProductEntity } from './entities/products.entity';
import ProductService from './services/product.service';
import CategoryService from './services/category.service';
import ProductController from './controllers/product.controller';
import { CategoryEntity } from './entities/category.entity';
import CategoryController from './controllers/category.controller';
import { RabbitMQConnection } from 'src/rabbit.connection';
import { MqListerner } from './services/mqListerner.service';

@Module({
  imports: [TypeOrmModule.forFeature([ProductEntity, CategoryEntity])],
  providers: [ProductService, CategoryService, RabbitMQConnection, MqListerner],
  controllers: [ProductController, CategoryController],
})
export class ProductsModule {}
