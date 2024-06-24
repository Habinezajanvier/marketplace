import { ApiProperty } from '@nestjs/swagger';
import { OrderEntity } from '../entities/orders.entitiy';

export enum OrderStatus {
  PENDING,
  PAID,
  DELIVERED,
}

export class Location {
  @ApiProperty()
  district: string;
  @ApiProperty()
  sector: string;
  @ApiProperty()
  village: string;
}

export class Product {
  @ApiProperty()
  id: number;
  @ApiProperty()
  quantity: number;
  @ApiProperty()
  price: number;
}

export class OrderDTO {
  createdBy: number;
  status?: OrderStatus;
  @ApiProperty({ type: Location })
  location: Location;
  @ApiProperty({ type: [Product] })
  products: Product[];
}

export class ProductOrderDTO {
  productId: number;
  order: OrderEntity;
  quantity: number;
  amount: number;
}
