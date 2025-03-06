import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  OneToMany,
  CreateDateColumn,
  UpdateDateColumn,
  JoinColumn,
  ManyToMany,
} from 'typeorm';
import { User } from './user.entity';
import { UserRoles } from './user-roles.entity';
//
@Entity('role')
export class Role {
  @PrimaryGeneratedColumn()
  id: string;

  //like ADMIN
  @Column()
  value: string;

  @ManyToMany(() => User, () => UserRoles)
  users: User[];
}
