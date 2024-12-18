import { Module } from '@nestjs/common';

import { CommentController } from './comment.controller';
import { CommentService } from './comment.service';
import { CommentRepository } from 'src/mongo/repository/comment/comment.repository';
import { MongooseModule } from '@nestjs/mongoose';
import { CommentSchema } from 'src/models/comment/comment.schema';
import { JwtService } from '@nestjs/jwt';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: 'Comment', schema: CommentSchema }]),
  ],
  providers: [
    {
      provide: 'CommentServiceInterface',
      useClass: CommentService,
    },
    {
      provide: 'CommentRepositoryInterface',
      useClass: CommentRepository,
    },
    JwtService,
  ],
  exports: [
    {
      provide: 'CommentServiceInterface',
      useClass: CommentService,
    },
  ],
  controllers: [CommentController],
})
export class CommentModule {}
