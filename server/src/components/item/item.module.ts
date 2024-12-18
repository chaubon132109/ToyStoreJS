import { Module } from '@nestjs/common';

import { ItemController } from './item.controller';
import { ItemService } from './item.service';
import { MongooseModule } from '@nestjs/mongoose';
import { ItemRepository } from 'src/mongo/repository/item/item.repository';
import { ItemSchema } from 'src/models/item/item.schema';
import { TiktokService } from '@components/tiktok/tikltok.service';
import { ImageRepository } from 'src/mongo/repository/image/image.repository';
import { ImageSchema } from 'src/models/image/image.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: 'Item', schema: ItemSchema },
      { name: 'Image', schema: ImageSchema },
    ]),
  ],
  providers: [
    {
      provide: 'ItemServiceInterface',
      useClass: ItemService,
    },
    {
      provide: 'ItemRepositoryInterface',
      useClass: ItemRepository,
    },
    {
      provide: 'ImageRepositoryInterface',
      useClass: ImageRepository,
    },
    {
      provide: 'TiktokServiceInterface',
      useClass: TiktokService,
    },
  ],
  exports: [
    {
      provide: 'ItemServiceInterface',
      useClass: ItemService,
    },
    {
      provide: 'ItemRepositoryInterface',
      useClass: ItemRepository,
    },
    {
      provide: 'ImageRepositoryInterface',
      useClass: ImageRepository,
    },
    {
      provide: 'TiktokServiceInterface',
      useClass: TiktokService,
    },
  ],
  controllers: [ItemController],
})
export class ItemModule {}
