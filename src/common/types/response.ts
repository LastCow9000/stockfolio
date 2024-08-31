export type VideoReponse = {
  id: number;
  filePath: string;
};

export type UploadVideoResponse = {
  success: boolean;
  data: VideoReponse[];
};

export type OriginalVideoListResponse = {
  success: boolean;
  data: VideoReponse[];
};
