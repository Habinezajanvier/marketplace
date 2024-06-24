import { Column, Entity, OneToMany } from 'typeorm';
import { BaseColumnSchema } from '../../baseEntinty';
import { OrderStatus, Location } from '../dto/orders.dto';
import { OrderItemsEntity } from './productOrder.entity';

@Entity({ name: 'orders' })
export class OrderEntity extends BaseColumnSchema {
  @OneToMany(() => OrderItemsEntity, (rel) => rel.order)
  orderItems: OrderItemsEntity;

  @Column({
    type: 'enum',
    enum: OrderStatus,
    default: OrderStatus.PENDING,
  })
  status: OrderStatus;

  @Column({ type: 'json' })
  location: Location;
}
