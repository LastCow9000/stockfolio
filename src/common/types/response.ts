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
