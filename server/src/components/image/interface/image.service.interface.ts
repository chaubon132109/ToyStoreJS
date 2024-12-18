
import { GetListImageRequestDto } from '../dto/request/get-list-image.request.dto';
import { GetDetailImageRequestDto } from '../dto/request/get-detail-image.request.dto';
import { CreateImageRequestDto } from '../dto/request/create-image.request.dto';
import { UpdateImageRequestDto } from '../dto/request/update-image.request.dto';
import { DeleteImageRequestDto } from '../dto/request/delete-image.request.dto';

export interface ImageServiceInterface {
  getList(request: GetListImageRequestDto): Promise<any>;
  getDetail(request: GetDetailImageRequestDto): Promise<any>;
  create(request: CreateImageRequestDto): Promise<any>;
  update(request: UpdateImageRequestDto): Promise<any>;
  delete(request: DeleteImageRequestDto): Promise<any>;
}
