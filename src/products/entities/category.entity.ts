import { Column, Entity } from 'typeorm';
import { BaseColumnSchema } from '../../baseEntinty';

@Entity({ name: 'category' })
export class CategoryEntity extends BaseColumnSchema {
  @Column()
  name: string;

  @Column('text', { nullable: true })
  description!: string;
}
