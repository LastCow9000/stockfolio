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

export type ConcatCommandType = Pick<
  ConcatCommand,
  'id' | 'status' | 'createdAt'
> & {
  commandInfos: Pick<ConcatInformation, 'order'> & {
    video: VideoReponse;
  };
};

export type AllConcatCommandListResponse = SuccessType & {
  data: ConcatCommandType[];
};
