import { Column, Entity, OneToOne, PrimaryGeneratedColumn } from 'typeorm';
import { User } from './user.entity';

@Entity()
export class UserPhoto {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ nullable: false })
  mime_type: string;

  @Column({ nullable: false })
  url: string;

  @OneToOne(() => User, (user) => user.photo, {
    cascade: true,
  })
  user: User;
}
