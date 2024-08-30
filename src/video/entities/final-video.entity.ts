import { FINAL_VIDEO } from 'src/common/constants/status';
import { FinalVideoStatus } from 'src/common/types/type';
import { ConcatCommand } from 'src/concat-command/entities/concat-command.entity';
import { TrimCommand } from 'src/trim-command/entities/trim-command.entity';
import {
  PrimaryGeneratedColumn,
  CreateDateColumn,
  Column,
  ManyToOne,
  Entity,
} from 'typeorm';

@Entity()
export class FinalVideo {
  @PrimaryGeneratedColumn('increment')
  id: number;

  @Column()
  filePath: string;

  @Column({ enum: FINAL_VIDEO })
  status: FinalVideoStatus;

  @ManyToOne(() => TrimCommand, { nullable: true })
  trimCommand: TrimCommand;

  @ManyToOne(() => ConcatCommand, { nullable: true })
  concatCommand: ConcatCommand;

  @CreateDateColumn()
  createdAt: Date;
}
