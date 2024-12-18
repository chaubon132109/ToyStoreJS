import { Module } from '@nestjs/common';

import { CategoryController } from './category.controller';
import { CategoryService } from './category.service';
import { CategoryRepository } from 'src/mongo/repository/category/category.repository';
import { MongooseModule } from '@nestjs/mongoose';
import { CategorySchema } from 'src/models/category/category.schema';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: 'Category', schema: CategorySchema }]),
  ],
  providers: [
    {
      provide: 'CategoryServiceInterface',
      useClass: CategoryService,
    },
    {
      provide: 'CategoryRepositoryInterface',
      useClass: CategoryRepository,
    },
  ],
  exports: [
    {
      provide: 'CategoryServiceInterface',
      useClass: CategoryService,
    },
  ],
  controllers: [CategoryController],
})
export class CategoryModule {}
