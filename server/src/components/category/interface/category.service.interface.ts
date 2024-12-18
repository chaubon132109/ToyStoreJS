
import { GetListCategoryRequestDto } from '../dto/request/get-list-category.request.dto';
import { GetDetailCategoryRequestDto } from '../dto/request/get-detail-category.request.dto';
import { CreateCategoryRequestDto } from '../dto/request/create-category.request.dto';
import { UpdateCategoryRequestDto } from '../dto/request/update-category.request.dto';
import { DeleteCategoryRequestDto } from '../dto/request/delete-category.request.dto';

export interface CategoryServiceInterface {
  getList(request: GetListCategoryRequestDto): Promise<any>;
  getDetail(request: GetDetailCategoryRequestDto): Promise<any>;
  create(request: CreateCategoryRequestDto): Promise<any>;
  update(request: UpdateCategoryRequestDto): Promise<any>;
  delete(request: DeleteCategoryRequestDto): Promise<any>;
}
