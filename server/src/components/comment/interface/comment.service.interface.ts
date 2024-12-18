import { GetListCommentRequestDto } from '../dto/request/get-list-comment.request.dto';
import { GetDetailCommentRequestDto } from '../dto/request/get-detail-comment.request.dto';
import { CreateCommentRequestDto } from '../dto/request/create-comment.request.dto';
import { UpdateCommentRequestDto } from '../dto/request/update-comment.request.dto';
import { DeleteCommentRequestDto } from '../dto/request/delete-comment.request.dto';
import { GetListCommentByItemRequestDto } from '../dto/request/get-comment-by-item-id.dto';

export interface CommentServiceInterface {
  getList(request: GetListCommentRequestDto): Promise<any>;
  getDetail(request: GetDetailCommentRequestDto): Promise<any>;
  create(request: CreateCommentRequestDto): Promise<any>;
  update(request: UpdateCommentRequestDto): Promise<any>;
  delete(request: DeleteCommentRequestDto): Promise<any>;
  getCommentByItemId(request: GetListCommentByItemRequestDto): Promise<any>;
}
