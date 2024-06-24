import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';
import { BaseColumnSchema } from '../../baseEntinty';
import { OrderEntity } from './orders.entitiy';

@Entity({ name: 'order_product' })
export class ProductsOrderEntinty extends BaseColumnSchema {
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
