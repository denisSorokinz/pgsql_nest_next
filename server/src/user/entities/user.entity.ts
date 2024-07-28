import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Position } from './position.entity';
import { UserPhoto } from './user-photo.entity';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ nullable: false })
  name: string;

  @Column({ unique: true, nullable: false })
  email: string;

  @Column({ unique: true, nullable: false })
  phone: string;

  @ManyToOne(() => Position, (position) => position.users)
  @JoinColumn({ name: 'position_id' })
  position: Position;

  @OneToOne(() => UserPhoto)
  @JoinColumn({ name: 'photo_id' })
  photo: UserPhoto;

  @CreateDateColumn()
  registration_timestamp: Date;
}
