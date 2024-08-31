export type VideoReponse = {
  id: number;
  filePath: string;
};

export type UploadVideoResponse = {
  success: boolean;
  data: VideoReponse[];
};
