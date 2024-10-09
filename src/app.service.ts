import { Injectable, OnModuleInit } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './user/entities/user.entity';
import { Repository } from 'typeorm';

@Injectable()
export class AppService implements OnModuleInit {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async onModuleInit() {
    const newUser1 = this.userRepository.create({
      name: '장원영',
      password: 'password1',
    });

    const newUser2 = this.userRepository.create({
      name: '아이유',
      password: 'password2',
    });

    await this.userRepository.save([newUser1, newUser2]);
  }
}
