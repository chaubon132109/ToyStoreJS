
import { Module } from '@nestjs/common';

import { ImageController } from './image.controller';
import { ImageService } from './image.service';
import { ImageRepository } from 'src/mongo/repository/image/image.repository';
import { MongooseModule } from '@nestjs/mongoose';
import { ImageSchema } from 'src/models/image/image.schema';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: 'Image', schema: ImageSchema }]),
  ],
  providers: [
    {
      provide:'ImageServiceInterface',
      useClass: ImageService,
    },
    {
      provide: 'ImageRepositoryInterface',
      useClass: ImageRepository,
    },
  ],
  exports: [
    {
      provide:'ImageServiceInterface',
      useClass: ImageService,
    }
  ],
  controllers: [ImageController]
})

export class ImageModule {}