import { GetListUserRequestDto } from '../dto/request/get-list-user.request.dto';
import { GetDetailUserRequestDto } from '../dto/request/get-detail-user.request.dto';
import { CreateUserRequestDto } from '../dto/request/create-user.request.dto';
import { UpdateUserRequestDto } from '../dto/request/update-user.request.dto';
import { DeleteUserRequestDto } from '../dto/request/delete-user.request.dto';

export interface UserServiceInterface {
  getList(request: GetListUserRequestDto): Promise<any>;
  getDetail(request: GetDetailUserRequestDto): Promise<any>;
  create(request: CreateUserRequestDto): Promise<any>;
  update(request: UpdateUserRequestDto): Promise<any>;
  delete(request: DeleteUserRequestDto): Promise<any>;
  getUserByUsername(username: string): Promise<any>;
  getUserDetail(request: any);
}
