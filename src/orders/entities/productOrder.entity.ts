import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';
import { BaseColumnSchema } from '../../baseEntinty';
import { OrderEntity } from './orders.entitiy';

@Entity({ name: 'order_items' })
export class OrderItemsEntity extends BaseColumnSchema {
  @ManyToOne(() => OrderEntity, { onDelete: 'CASCADE' })
  @JoinColumn()
  order: OrderEntity;

  @Column()
  productId: number;

  @Column()
  quantity: number;

  @Column()
  amount: number;
}
