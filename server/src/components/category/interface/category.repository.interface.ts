import { BaseInterfaceRepository } from '@core/repository/base.interface.repository';
import { GetListCategoryRequestDto } from '../dto/request/get-list-category.request.dto';
import { GetDetailCategoryRequestDto } from '../dto/request/get-detail-category.request.dto';
import { Category } from 'src/models/category/category.schema';

export interface CategoryRepositoryInterface
  extends BaseInterfaceRepository<Category> {
  createDocument(request: any): Category;
  updateDocument(category: Category, request: any): Category;
  getList(request: GetListCategoryRequestDto): Promise<any>;
  getDetail(request: GetDetailCategoryRequestDto): Promise<any>;
}
