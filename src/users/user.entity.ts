import { Column, Entity } from 'typeorm';
import { BaseColumnSchema } from '../baseEntinty';
import { Role, UserStatus } from './constant';

@Entity({ name: 'users' })
export class UserEntity extends BaseColumnSchema {
  @Column()
  firstName: string;

  @Column()
  lastName: string;

  @Column({ unique: true })
  email: string;

  @Column()
  phoneNumber: string;

  @Column({ nullable: true })
  otp: string;

  @Column({ default: false })
  verified: boolean;

  @Column({
    type: 'enum',
    enum: UserStatus,
    default: UserStatus.ACTIVE,
  })
  status: UserStatus;

  @Column()
  password: string;

  @Column({
    type: 'enum',
    enum: Role,
    default: Role.Buyer,
  })
  role: Role;
}
