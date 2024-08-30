import { ConcatCommand } from 'src/concat-command/entities/concat-command.entity';
import { Video } from 'src/video/entities/video.entity';
import {
  PrimaryGeneratedColumn,
  CreateDateColumn,
  Column,
  ManyToOne,
  Entity,
} from 'typeorm';

@Entity()
export class ConcatInformation {
  @PrimaryGeneratedColumn('increment')
  id: number;

  @Column()
  order: number;

  @ManyToOne(() => Video)
  video: Video;

  @ManyToOne(() => ConcatCommand)
  concatCommand: ConcatCommand;

  @CreateDateColumn()
  createdAt: Date;
}
