export const VIDEO = {
  UPLOADING: 'uploading',
  UPLOADED: 'uploaded',
} as const;

export const COMMAND = {
  PENDING: 'pending',
  DONE: 'done',
  FAIL: 'fail',
} as const;

export const FINAL_VIDEO = {
  PROCCESSING: 'processing',
  DONE: 'done',
  FAIL: 'fail',
} as const;

export const VIDEO_EXTENSIONS = [
  '.mp4',
  '.m4v',
  '.avi',
  '.wmv',
  '.asf',
  '.mpg',
  '.mpeg',
  '.mkv',
  '.mov',
  '.webm',
];
