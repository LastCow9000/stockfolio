import { join } from 'path';

export const ROOT_PATH = process.cwd();

export const VIDEO_PATH = join(ROOT_PATH, 'public');

export const ORIGINAL_VIDEO_PATH = join(VIDEO_PATH, 'origin-videos');

export const PUBLIC_ORIGINAL_VIDEO_PATH = join('public', 'origin-videos');

export const FINAL_VIDEO_PATH = join(VIDEO_PATH, 'final-videos');

export const PUBLIC_FINAL_VIDEO_PATH = join('public', 'final-videos');

export const TEMP_PATH = join(VIDEO_PATH, 'temp');
