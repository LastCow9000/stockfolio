import { join } from 'path';
import { FINAL_VIDEO_PATH, PUBLIC_FINAL_VIDEO_PATH } from '../constants/path';

export const getOutputInfo = (type: 'trim' | 'concat', filePath: string) => {
  const outputFileName = `${type === 'trim' ? 'trimmed' : 'concated'}_${Date.now()}.${filePath.split('.').pop()}`;
  const outputPath = join(FINAL_VIDEO_PATH, outputFileName);
  const publicOutputPath = join(PUBLIC_FINAL_VIDEO_PATH, outputFileName);

  return { outputFileName, outputPath, publicOutputPath };
};
