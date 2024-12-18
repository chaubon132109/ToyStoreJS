
import { BaseInterfaceRepository } from '@core/repository/base.interface.repository';
import { GetListImageRequestDto } from '../dto/request/get-list-image.request.dto';
import { GetDetailImageRequestDto } from '../dto/request/get-detail-image.request.dto';
import {  Image } from 'src/models/image/image.schema';

export interface ImageRepositoryInterface
 extends BaseInterfaceRepository<Image>  {
  createDocument(request: any): Image;
  updateDocument(image: Image, request: any): Image;
  getList(request: GetListImageRequestDto): Promise<any>;
  getDetail(request: GetDetailImageRequestDto): Promise<any>;
}
