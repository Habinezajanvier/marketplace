import { Column, Entity, JoinTable, ManyToMany } from 'typeorm';
import { BaseColumnSchema } from '../../baseEntinty';
import { CategoryEntity } from './category.entity';

@Entity({ name: 'products' })
export class ProductEntity extends BaseColumnSchema {
  @Column()
  name: string;

  //   @Column({
  //     type: "enum",
  //     enum: ProductType,
  //   })
  //   type: ProductType;

  @Column()
  price: number;

  @Column()
  quantity: number;

  @Column({ nullable: true })
  picture: string;

  @Column('text', {
    array: true,
    nullable: true,
  })
  avatars: string[];

  @ManyToMany(() => CategoryEntity)
  @JoinTable()
  categories: CategoryEntity[];
}
