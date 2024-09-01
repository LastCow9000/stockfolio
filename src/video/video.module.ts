import { BadRequestException, Module } from '@nestjs/common';
import { VideoService } from './video.service';
import { VideoController } from './video.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Video } from './entities/video.entity';
import { FinalVideo } from '../final-video/entities/final-video.entity';
import { User } from 'src/user/entities/user.entity';
import { MulterModule } from '@nestjs/platform-express';
import { extname } from 'path';
import { VIDEO_EXTENSIONS } from 'src/common/constants/status';
import { diskStorage } from 'multer';
import { ORIGINAL_VIDEO_PATH } from 'src/common/constants/path';
import { uuid } from 'uuidv4';
import { TrimCommand } from 'src/trim-command/entities/trim-command.entity';
import { ConcatCommand } from 'src/concat-command/entities/concat-command.entity';
import { ConcatInformation } from 'src/concat-command/entities/concat-information.entity';
import VideoFacade from './video.facade';
import { ConcatCommandModule } from 'src/concat-command/concat-command.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Video,
      FinalVideo,
      User,
      TrimCommand,
      ConcatCommand,
      ConcatInformation,
    ]),
    MulterModule.register({
      fileFilter: (req, file, cb) => {
        const ext = extname(file.originalname);
        if (!VIDEO_EXTENSIONS.includes(ext.toLowerCase())) {
          return cb(
            new BadRequestException('동영상 파일만 업로드 가능합니다.'),
            false,
          );
        }

        return cb(null, true);
      },
      storage: diskStorage({
        destination: ORIGINAL_VIDEO_PATH,
        filename: (req, file, cb) => {
          const filename = uuid();
          const extension = extname(file.originalname);

          cb(null, `${filename}${extension}`);
        },
      }),
    }),
    ConcatCommandModule,
  ],
  controllers: [VideoController],
  providers: [VideoService, VideoFacade],
})
export class VideoModule {}
