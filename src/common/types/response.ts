import { ConcatCommand } from 'src/concat-command/entities/concat-command.entity';
import { ConcatInformation } from 'src/concat-command/entities/concat-information.entity';
import { TrimCommand } from 'src/trim-command/entities/trim-command.entity';

export type SuccessType = {
  success: boolean;
};

export type VideoReponse = {
  id: number;
  filePath: string;
};

export type UploadVideoResponse = SuccessType & {
  data: VideoReponse[];
};

export type OriginalVideoListResponse = SuccessType & {
  data: VideoReponse[];
};

export type CreateTrimCommandResponse = SuccessType;

export type TrimCommandType = Pick<
  TrimCommand,
  'id' | 'startTime' | 'endTime' | 'status' | 'createdAt'
> & {
  video: VideoReponse;
};

export type AllTrimCommandListReponse = SuccessType & {
  data: TrimCommandType[];
};

export type CreateConcatCommandResponse = SuccessType;

export type CommandInfo = Pick<ConcatInformation, 'order'> & {
  video: VideoReponse;
};

export type ConcatCommandType = ConcatCommand & {
  commandInfos: CommandInfo[];
};

export type AllConcatCommandListResponse = SuccessType & {
  data: ConcatCommandType[];
};

export type CommonExcuteCommand = {
  success: boolean;
  command: 'trim' | 'concat';
  commandId: number;
  filePath?: string;
  reason?: string;
};

export type ExecuteTrimCommand = CommonExcuteCommand & {
  originVideoId: number;
};

export type ExecuteConcatCommand = {
  originVideoIds: number[];
};

export type ExecuteCommandResponse = (
  | ExecuteTrimCommand
  | ExecuteConcatCommand
)[];
