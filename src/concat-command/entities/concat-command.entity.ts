import { COMMAND } from 'src/common/constants/status';
import { CommandStatus } from 'src/common/types/status';
import {
  PrimaryGeneratedColumn,
  CreateDateColumn,
  Column,
  Entity,
} from 'typeorm';

@Entity()
export class ConcatCommand {
  @PrimaryGeneratedColumn('increment')
  id: number;

  @Column({ enum: Object.values(COMMAND) })
  status: CommandStatus;

  @CreateDateColumn()
  createdAt: Date;
}
