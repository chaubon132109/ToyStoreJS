import { GetListItemRequestDto } from '../dto/request/get-list-item.request.dto';
import { GetDetailItemRequestDto } from '../dto/request/get-detail-item.request.dto';
import {
  CreateFormItemRequestDto,
  CreateItemRequestDto,
} from '../dto/request/create-item.request.dto';
import { UpdateItemRequestDto } from '../dto/request/update-item.request.dto';
import { DeleteItemRequestDto } from '../dto/request/delete-item.request.dto';
import { Item } from 'src/models/item/item.schema';

export interface ItemServiceInterface {
  getList(request: GetListItemRequestDto): Promise<any>;
  getDetail(request: GetDetailItemRequestDto): Promise<any>;
  create(request: CreateFormItemRequestDto): Promise<any>;
  update(request: UpdateItemRequestDto): Promise<any>;
  delete(request: DeleteItemRequestDto): Promise<any>;
  getItemsByIds(ids: any): Promise<Item[]>;
  updateItems(items: Item[]): Promise<any>;
  updateStatusTikTokProduct(request: any): Promise<any>;
  getItemsByTiktokIds(ids: string[]): Promise<any>;
  bulkWrite(request: any): Promise<any>;
}
