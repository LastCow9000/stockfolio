import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from './user/user.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { VideoModule } from './video/video.module';
import { TrimCommandModule } from './trim-command/trim-command.module';
import { ConcatCommandModule } from './concat-command/concat-command.module';
import { ConcatInformationModule } from './concat-information/concat-information.module';
import { FinalVideoModule } from './final-video/final-video.module';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'sqlite',
      database: 'sqlite.db',
      autoLoadEntities: true,
      synchronize: true,
      logging: true,
    }),
    UserModule,
    VideoModule,
    TrimCommandModule,
    ConcatCommandModule,
    ConcatInformationModule,
    FinalVideoModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
