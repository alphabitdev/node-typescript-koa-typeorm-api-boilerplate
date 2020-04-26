import { Entity, Column } from 'typeorm';
import BaseEntity from './BaseEntity';

export interface CreateUser {
  username: string;
  password: string;
}
@Entity() // eslint-disable-next-line import/prefer-default-export
export class User extends BaseEntity {
  @Column({ unique: true })
  username!: string;

  @Column()
  password!: string;

  @Column({ nullable: true })
  name!: string;

  @Column({ default: 'user' })
  role!: string;

  @Column({ default: false })
  activated!: boolean;

  @Column({ nullable: true })
  api_key!: string;
}
