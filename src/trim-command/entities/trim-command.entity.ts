import { COMMAND } from 'src/common/constants/status';
import { CommandStatus } from 'src/common/types/status';
import { Video } from 'src/video/entities/video.entity';
import {
  PrimaryGeneratedColumn,
  CreateDateColumn,
  Column,
  ManyToOne,
  Entity,
} from 'typeorm';

@Entity()
export class TrimCommand {
  @PrimaryGeneratedColumn('increment')
  id: number;

  @Column()
  startTime: string;

  @Column()
  endTime: string;

  @Column({ enum: Object.values(COMMAND) })
  status: CommandStatus;

  @ManyToOne(() => Video)
  video: Video;

  @CreateDateColumn()
  createdAt: Date;
}
