import { BaseInterfaceRepository } from '@core/repository/base.interface.repository';
import { GetListItemRequestDto } from '../dto/request/get-list-item.request.dto';
import { GetDetailItemRequestDto } from '../dto/request/get-detail-item.request.dto';
import { Item } from 'src/models/item/item.schema';

export interface ItemRepositoryInterface extends BaseInterfaceRepository<Item> {
  createDocument(request: any): Item;
  updateDocument(item: Item, request: any): Item;
  getList(request: GetListItemRequestDto): Promise<any>;
  getDetail(id: string): Promise<any>;
  totalStock(): Promise<number>;
  countStockStatus(): Promise<{
    inStock: number;
    lowStock: number;
    outOfStock: number;
  }>;
}
