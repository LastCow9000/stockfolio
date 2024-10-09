import { User } from 'src/user/entities/user.entity';
import {
  PrimaryGeneratedColumn,
  CreateDateColumn,
  Column,
  ManyToOne,
  Entity,
} from 'typeorm';
import { VIDEO } from 'src/common/constants/status';
import { VideoStatus } from 'src/common/types/status';

@Entity()
export class Video {
  @PrimaryGeneratedColumn('increment')
  id: number;

  @Column()
  filePath: string;

  @Column({ enum: Object.values(VIDEO) })
  status: VideoStatus;

  @ManyToOne(() => User)
  user: User;

  @CreateDateColumn()
  createdAt: Date;
}
