import { Column, Entity, OneToMany } from 'typeorm';
import { BaseColumnSchema } from '../../baseEntinty';
import { OrderStatus, Location } from '../dto/orders.dto';
import { ProductsOrderEntinty } from './productOrder.entity';

@Entity({ name: 'orders' })
export class OrderEntity extends BaseColumnSchema {
  @OneToMany(() => ProductsOrderEntinty, (rel) => rel.order)
  productOder: ProductsOrderEntinty;

  @Column({
    type: 'enum',
    enum: OrderStatus,
    default: OrderStatus.PENDING,
  })
  status: OrderStatus;

  @Column({ type: 'json' })
  location: Location;
}
