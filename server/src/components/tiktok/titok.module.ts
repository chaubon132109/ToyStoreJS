import { Module } from '@nestjs/common';
import { UserRepository } from 'src/mongo/repository/user/user.repository';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from 'src/models/user/user.schema';
import { TiktokService } from './tikltok.service';

@Module({
  imports: [],
  providers: [
    {
      provide: 'TiktokServiceInterface',
      useClass: TiktokService,
    },
  ],
  exports: [
    {
      provide: 'TiktokServiceInterface',
      useClass: TiktokService,
    },
  ],
})
export class TiktokModule {}
