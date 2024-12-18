import { GetListUserRequestDto } from '../dto/request/get-list-user.request.dto';
import { GetDetailUserRequestDto } from '../dto/request/get-detail-user.request.dto';
import { BaseInterfaceRepository } from '@core/repository/base.interface.repository';
import { User } from 'src/models/user/user.schema';

export interface UserRepositoryInterface extends BaseInterfaceRepository<User> {
  createEntity(request: any): User;
  updateDocument(user: User, request: any): User;
  getList(request: GetListUserRequestDto): Promise<any>;
  getDetail(request: GetDetailUserRequestDto): Promise<User>;
  checkLogin(user, password): Promise<any>;
  countCustomer(): Promise<any>;
}
