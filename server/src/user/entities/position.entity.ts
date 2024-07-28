import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { UserPosition } from '../enums/UserPosition';
import { User } from './user.entity';

@Entity()
export class Position {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'enum', enum: UserPosition, nullable: false })
  name: UserPosition;

  @OneToMany(() => User, (user) => user.position, { cascade: true })
  users: User[];
}
